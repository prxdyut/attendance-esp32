import express from "express";
import { Batch, User } from "../mongodb/models";

const router = express.Router();

// Create a batch
router.post("/", async (req, res) => {
  try {
    const batch = new Batch({ name: req.body.name });
    await batch.save();
    const users =
      typeof req.body.userIds === "string"
        ? [req.body.userIds]
        : req.body.userIds;

    for (const user of users) {
      console.log(user);
      const userRef = await User.findById(user);
      console.log(userRef);
      if (userRef?.role == "student") {
        userRef.batchIds = [batch._id];
      }
      if (userRef?.role == "faculty") {
        userRef.batchIds = [...userRef.batchIds, batch._id];
      }
      await userRef?.save();
      console.log(userRef);
    }
    res.status(201).json({
      success: true,
      data: { batch },
      message: "Batch created successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get All Batches
router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json({ success: true, data: { batches } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get A Single Batch
router.get("/:id", async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch)
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });
    const students = await User.find({ role: "student", batchIds: batch._id });
    const faculty = await User.find({ role: "faculty", batchIds: batch._id });
    res.json({ success: true, data: { batch, students, faculty } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TODO: also allow removing or adding students
router.post("/:id/edit", async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!batch)
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });

    await User.updateMany(
      {
        _id: { $nin: req.body.userIds },
        batchIds: { $in: [batch._id] },
      },
      {
        $pull: { batchIds: batch._id },
      }
    );

    for (const user of req.body.userIds) {
      const userRef = await User.findById(user);
      if (userRef?.role == "student") {
        userRef.batchIds = [batch._id];
      }
      if (userRef?.role == "faculty") {
        userRef.batchIds = [...userRef.batchIds, batch._id];
      }
      await userRef?.save();
    }

    res.json({ success: true, data: batch });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch)
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });

    await User.updateMany(
      {
        batchIds: { $in: [batch._id] },
      },
      {
        $pull: { batchIds: batch._id },
      }
    );
    res.json({ success: true, message: "Batch deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
