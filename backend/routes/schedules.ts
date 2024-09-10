// routes/schedules.js
import express from "express";
import { Schedule } from "../mongodb/models";
import { addDays, endOfDay, startOfDay } from "date-fns";

const router = express.Router();

// Get all schedules
router.get("/", async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      batchId,
      page = 1,
      rows = 10,
      search = "",
      selectedIds = "",
    } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(rows as string);

    let query: any = {};
    query.deleted = false;

    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate as string)),
        $lte: endOfDay(new Date(endDate as string)),
      };
    }

    if (batchId) {
      query.batchId = batchId;
    }

    if (selectedIds) {
      query.batchIds = {
        $in: (selectedIds as string).split(","),
      };
    }

    if (search) {
      query.$or = [{ subject: { $regex: search, $options: "i" } }];
    }

    const count = await Schedule.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const schedules = await Schedule.find(query)
      .populate("batchIds")
      .sort({ timestamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: true,
      data: { schedules },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a schedules
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const schedule = await Schedule.findOne({ _id: id, deleted: false });

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
    await Schedule.findByIdAndUpdate(
      id,
      { deleted: true },
      {
        new: true,
      }
    );
    res.json({ success: true, message: "Schedule deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
