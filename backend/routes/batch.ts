import express from "express";
import { Batch, User } from "../mongodb/models";

const router = express.Router();

// Create a batch
router.post("/", async (req, res) => {
  try {
    const batch = new Batch({ name: req.body.name });
    await batch.save();
    const users =
      typeof req.body.userIds === "undefined"
        ? undefined
        : typeof req.body.userIds === "string"
        ? [req.body.userIds]
        : req.body.userIds;

    if (users) {
      for (const user of users) {
        const userRef = await User.findById(user);
        console.log(userRef);
        if (userRef?.role == "student") {
          userRef.batchIds = [batch._id];
        }
        if (userRef?.role == "faculty") {
          userRef.batchIds = [...userRef.batchIds, batch._id];
        }
        await userRef?.save();
      }
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
  const { page = 1, rows = 10, search = "" } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(rows as string);

  try {
    const query: any = { deleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const count = await Batch.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const batches = await Batch.find(query)
      .sort({ timestamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const BATCHES = await Promise.all(
      batches.map(async (batch) => ({
        ...batch.toJSON(),
        students: await User.find({
          role: "student",
          batchIds: { $in: batch._id },
          deleted: false,
        }).populate("batchIds"),
        faculty: await User.find({
          role: "faculty",
          batchIds: { $in: batch._id },
          deleted: false,
        }).populate("batchIds"),
      }))
    );
    res.json({
      success: true,
      data: { batches: BATCHES },
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

// Get A Single Batch
router.get("/:id", async (req, res) => {
  try {
    const batch = await Batch.findOne({ _id: req.params.id, deleted: false });
    if (!batch)
      return res
        .status(404)
        .json({ success: false, message: "Batch not found" });
    const students = await User.find({
      role: "student",
      batchIds: batch._id,
      deleted: false,
    }).populate("batchIds");
    const faculty = await User.find({
      role: "faculty",
      batchIds: batch._id,
      deleted: false,
    }).populate("batchIds");
    res.json({ success: true, data: { batch, students, faculty } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific score
router.get("/:ids/students", async (req, res) => {
  const ids = req.params.ids;
  const role = req.query.role;

  try {
    const students = await User.find({
      batchIds: { $in: ids.split(",") },
      role,
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
        const newArr = Array.from(
          new Set([...userRef.batchIds].map((_) => _.toString()))
        );

        if (!newArr.includes(batch._id.toString()))
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
