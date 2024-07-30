import express from "express";
import { Holiday, User } from "../mongodb/models";
import type { ObjectId } from "mongoose";
import { addMessageToQueue } from "./whatsapp";
import { getMessage } from "../utils/message";

const router = express.Router();

// Create a new holiday
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
  try {
    const holidays = await Holiday.find();
    res.json({ success: true, data: holidays });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
