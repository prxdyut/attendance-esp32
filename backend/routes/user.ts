import express from "express";
import { NewCard, Punch, Score, User } from "../mongodb/models";
import { addDays } from "date-fns";

import { Types } from "mongoose";
import { endOfDay, startOfDay } from "date-fns";
const { ObjectId } = Types;

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    if (user.cardUid) {
      await NewCard.deleteMany({ uid: user.cardUid });
    }

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  const {
    role,
    page = 1,
    rows = 10,
    search = "",
    selectedIds = "",
  } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(rows as string);

  try {
    const query: any = { deleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { cardUid: { $regex: search, $options: "i" } },
      ];
    }

    if (selectedIds as string) {
      query.batchIds = {
        $in: (selectedIds as string).split(","),
      };
    }

    if (role) query.role = [role];
    else query.role = ["student", "faculty"];

    const count = await User.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const users = await User.find(query)
      .populate("batchIds")
      .sort({ timestamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: true,
      data: { users },
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

router.get("/data", async (req, res) => {
  let {
    userId,
    startDate,
    endDate,
    punches,
    scores,
    page = 1,
    rows = 10,
    search = "",
  } = req.query;

  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(rows as string) || 10;

  try {
    const user = await User.findOne({ _id: userId }).populate("batchIds");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let count = 0;
    let pages = 0;

    if (punches) {
      count = await Punch.countDocuments({
        userId: user._id,
        timestamp: {
          $gte: new Date(startDate as string),
          $lte: addDays(endDate as string, 1),
        },
      });
      pages = Math.ceil(count / limitNumber);
    }
    const punchesData = punches
      ? await Punch.find({
          userId: user._id,
          timestamp: {
            $gte: new Date(startDate as string),
            $lte: addDays(endDate as string, 1),
          },
        })
          .sort({ timestamp: -1 })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
      : [];
    let query:any = {
      "obtained.studentId": new ObjectId(user._id),
    };
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }
    if (scores) {
      count = await Score.countDocuments(query);
      pages = Math.ceil(count / limitNumber);
    }

    const scoresData = scores
      ? await Score.find(query)
          .populate("batchIds")
          .sort({ timestamp: -1 })
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber)
      : [];

    // Process the scores to mark absences and format the response
    const processedScores = scoresData.map((score) => {
      const studentScore = score.obtained.find(
        (item) => item.studentId.toString() === user._id.toString()
      );

      return {
        _id: score._id,
        subject: score.subject,
        date: score.date,
        total: score.total,
        title: score.title,
        batchIds: score.batchIds,
        marks: studentScore?.marks === -1 ? "Absent" : studentScore?.marks,
        percentage:
          studentScore?.marks === -1
            ? "N/A"
            : ((studentScore?.marks / score.total) * 100).toFixed(2) + "%",
      };
    });

    res.json({
      success: true,
      data: {
        userData: user,
        punches: punchesData,
        scores: processedScores,
      },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TODO : return statistics data
// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ data: user, success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a user
router.post("/:id/edit", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update a user
router.post("/:userId/:batchId/remove", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $pull: {
          batchIds: req.params.batchId,
        },
      },
      {
        new: true,
      }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { cardUid: undefined, deleted: true },
      { new: true }
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
