// routes/resources.ts

import express from "express";
import fs from "fs";
import { Resource } from "../mongodb/models";
import { endOfDay, startOfDay } from "date-fns";

const router = express.Router();

// Upload a new resource
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const resource = new Resource({ ...req.body, all: Boolean(req.body.all) });
    await resource.save();

    res.json({ success: true, data: resource });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  const {
    startDate,
    endDate,
    page = 1,
    rows = 10,
    search = "",
    selectionType,
    selectedIds = "",
  } = req.query;
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
      deleted: false,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    
    if (
      selectedIds &&
      (selectionType == "batchIds" || selectionType == "userIds")
    ) {
      query[selectionType] = {
        $in: (selectedIds as string).split(",").filter(Boolean),
      };
    } else if (selectionType == "all") {
      query.all = true;
    }

    const count = await Resource.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const resources = await Resource.find(query)
      .populate("batchIds")
      .populate("userIds")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ date: 1 }); // Ensure consistent sorting;
    console.log({
      success: true,
      data: { resources },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
    res.json({
      success: true,
      data: { resources },
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

// Delete a resource
router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    // Delete resource from database
    await Resource.findByIdAndUpdate(id, { deleted: true });

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
