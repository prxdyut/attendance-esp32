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
  const { startDate, endDate } = req.query;
  const start = startOfDay(startDate as string);

  const end = endOfDay(endDate as string);

  try {
    const alerts = await Alert.find({
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("batchIds")
      .populate("userIds");
    res.json({ success: true, data: alerts });
  } catch (error: any) {
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
