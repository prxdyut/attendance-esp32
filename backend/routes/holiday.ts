import express from "express";
import { Holiday, User } from "../mongodb/models";
import type { ObjectId } from "mongoose";
import { addMessageToQueue } from "./whatsapp";
import { getMessage } from "../utils/message";
import { endOfDay, startOfDay } from "date-fns";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const holiday = new Holiday({ ...req.body, all: req.body.all === "all" });
    await holiday.save();

    let users: any[] = [];
    if (req.body.all === "all") {
      users = await User.find();
    } else if (req.body?.userIds) {
      users = await User.find({ _id: req.body.userIds });
    } else if (req.body?.batchIds) {
      users = await User.find({ batchIds: req.body.batchIds });
    }

    users.forEach((user) => {
      addMessageToQueue({
        userId: user._id,
        message: getMessage({
          studentId: user.cardUid,
          studentName: user.name,
          eventType: "holiday",
          timestamp: holiday.date,
        }),
      });
    });

    res.status(201).json({ success: true, data: holiday });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all holidays
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startOfDay(startDate as string);

  const end = endOfDay(endDate as string);

  try {
    let holidays;
    if (startDate && endDate)
      holidays = await Holiday.find({
        date: {
          $gte: start,
          $lte: end,
        },
        deleted: false,
      })
        .populate("batchIds")
        .populate("userIds");

    res.json({ success: true, data: holidays });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let holiday: any = await Holiday.findOne({ _id: id, deleted: false })
      .populate("batchIds")
      .populate("userIds");

    if (holiday && holiday.batchIds && holiday.batchIds.length > 0) {
      const batchUsers = await User.find({
        batchIds: { $in: holiday.batchIds },
      });
      holiday.userIds = batchUsers;
    }

    res.json({ success: true, data: holiday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Holiday.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    await Holiday.findByIdAndUpdate(id, { deleted: true });

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
