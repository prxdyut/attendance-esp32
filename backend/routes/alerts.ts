// routes/alerts.ts

import express from "express";
import { Alert, User } from "../mongodb/models";
import { endOfDay, startOfDay } from "date-fns";

const router = express.Router();

// Create a new alert
router.post("/", async (req, res) => {
  try {
    const alert = new Alert({ ...req.body, all: Boolean(req.body.all) });
    await alert.save();
    res.json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all alerts
router.get("/", async (req, res) => {
  const { startDate, endDate, page = 1, rows = 10, search = "" } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(rows as string);

  const start = startOfDay(startDate as string);
  const end = endOfDay(endDate as string);

  try {
    let query: any = {
      date: {
        $gte: start,
        $lte: end,
      },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const count = await Alert.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const alerts = await Alert.find(query)
      .populate("batchIds")
      .populate("userIds")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ date: 1 }); // Ensure consistent sorting

    res.json({
      success: true,
      data: {alerts},
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error: any) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all alerts
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let alert: any = await Alert.findOne({ _id: id })
      .populate("batchIds")
      .populate("userIds");

    if (alert && alert.batchIds && alert.batchIds.length > 0) {
      const batchUsers = await User.find({
        batchIds: { $in: alert.batchIds },
      });
      alert.userIds = batchUsers;
    }

    res.json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an alert
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id);
    res.json({ success: true, message: "Alert deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
