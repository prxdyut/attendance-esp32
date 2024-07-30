import express from "express";
import { Template } from "../mongodb/models";

const router = express.Router();

// Get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a template
router.post("/:id/edit", async (req, res) => {
  try {
    const templates = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!templates)
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;