// routes/schedules.js
import express from "express";
import { Schedule } from "../mongodb/models";

const router = express.Router();

// Get all schedules
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, batchId } = req.query;
    let query: any = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    if (batchId) {
      query.batchId = batchId;
    }

    const schedules = await Schedule.find(query)
      .populate("batchIds")
      .populate("scheduledBy")
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a schedules
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const schedule = await Schedule.findById(id);

    res.json({ success: true, data: { schedule } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new schedule
router.post("/", async (req, res) => {
  console.log("new Schedule", req.body);
  try {
    console.log(req.body);
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json({ success: true, data: newSchedule });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a schedule
router.post("/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, update, {
      new: true,
    });
    res.json({ success: true, data: updatedSchedule });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a schedule
router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    res.json({ success: true, message: "Schedule deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
