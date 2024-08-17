// routes/resources.ts

import express from "express";
import fs from "fs";
import { Resource } from "../mongodb/models";

const router = express.Router();

// Upload a new resource
router.post("/", async (req, res) => {
  console.log(req.body)
  try {
    const resource = new Resource(req.body);
    await resource.save();

    res.json({ success: true, data: resource });
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json({ success: true, data: resources });
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
    await Resource.findByIdAndDelete(id);

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
