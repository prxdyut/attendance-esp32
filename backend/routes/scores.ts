// routes/scores.js
import express from "express";
import { Score, User } from "../mongodb/models";

const router = express.Router();

// Create a new score
router.post("/", async (req, res) => {
  const { obtained, batchIds } = req.body;

  const students = await User.find({
    batchIds: { $in: batchIds },
    role: "student",
  });

  let obtainedArray = students.map((student, i) => ({
    studentId: student._id,
    marks: obtained[i],
  }));

  try {
    const newScore = new Score({...req.body, obtained: obtainedArray});
    await newScore.save();
    res.status(201).json({ success: true, data: newScore });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all scores
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find().populate("batchIds");
    res.json({ success: true, data: scores });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific score
router.get("/:id", async (req, res) => {
  try {
    const score = await Score.findById(req.params.id).populate("batchIds");
    if (!score) {
      return res
        .status(404)
        .json({ success: false, message: "Score not found" });
    }
    res.json({ success: true, data: score });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific score
router.get("/:ids/batch", async (req, res) => {
  const ids = req.params.ids;
  try {
    const students = await User.find({
      batchIds: { $in: ids.split(",") },
      role: "student",
    });
    if (!students) {
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });
    }
    res.json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a score
router.post("/:id/edit", async (req, res) => {
  try {
    const { obtained, batchIds } = req.body;
  
    const students = await User.find({
      batchIds: { $in: batchIds },
      role: "student",
    });
  
    let obtainedArray = students.map((student, i) => ({
      studentId: student._id,
      marks: obtained[i],
    }));

    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      {...req.body, obtained: obtainedArray},
      { new: true }
    );
    if (!updatedScore) {
      return res
        .status(404)
        .json({ success: false, message: "Score not found" });
    }
    res.json({ success: true, data: updatedScore });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a score
router.post("/:id/delete", async (req, res) => {
  try {
    const deletedScore = await Score.findByIdAndDelete(req.params.id);
    if (!deletedScore) {
      return res
        .status(404)
        .json({ success: false, message: "Score not found" });
    }
    res.json({ success: true, message: "Score deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
