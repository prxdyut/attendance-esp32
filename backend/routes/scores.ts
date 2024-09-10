// routes/scores.js
import express from "express";
import { Score, User } from "../mongodb/models";
import { fetchData } from "./statistics";
import { Types } from "mongoose";
import { endOfDay, startOfDay } from "date-fns";
const { ObjectId } = Types;

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
    const newScore = new Score({ ...req.body, obtained: obtainedArray });
    await newScore.save();
    res.status(201).json({ success: true, data: newScore });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  const { startDate, endDate, page = 1, rows = 10, search = "", selectedIds = "" } = req.query;
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(rows as string) || 10;

  try {
    const query: any = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (selectedIds) {
      query.batchIds = {
        $in: (selectedIds as string).split(",").filter(Boolean), // Filter out empty values
      };
    }

    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate as string)),
        $lte: endOfDay(new Date(endDate as string)),
      };
    }

    console.log("Query:", query); // Log query for debugging

    const count = await Score.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const scores = await Score.find(query)
      .populate("batchIds")
      .sort({ timestamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: true,
      data: {
        scores,
      },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.get("/statistics", async (req, res) => {
  try {
    const {
      selectionType,
      selectedIds,
      startDate,
      endDate,
      page = 1,
      rows = 10,
      search = "",
    } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(rows as string);

    let userIds: string[] = [];
    if (selectionType && selectedIds) {
      const { userIds: fetchedUserIds } = await fetchData(
        selectionType as string,
        selectedIds as string
      );
      userIds = fetchedUserIds;
    } else {
      userIds = await User.find({ role: "student" }).distinct("_id").lean();
    }

    const userObjectIds = userIds.map((id) => new ObjectId(id));
    const totalStudents = userObjectIds.length;

    const examStats = await Score.aggregate([
      {
        $match: {
          "obtained.studentId": {
            $in: userObjectIds,
          },
          // date: { $gte: start, $lte: end },
        },
      },
      {
        $facet: {
          totalExams: [{ $count: "count" }],
          averagePerformance: [
            {
              $unwind: "$obtained",
            },
            {
              $match: { "obtained.studentId": { $in: userObjectIds } },
            },
            {
              $group: {
                _id: null,
                totalMarks: {
                  $sum: {
                    $cond: [
                      { $eq: ["$obtained.marks", -1] },
                      0,
                      "$obtained.marks",
                    ],
                  },
                },
                totalPossible: { $sum: "$total" },
                examsTaken: {
                  $sum: {
                    $cond: [{ $ne: ["$obtained.marks", -1] }, 1, 0],
                  },
                },
                totalAttempts: { $sum: 1 },
              },
            },
            {
              $project: {
                averagePercentage: {
                  $multiply: [
                    { $divide: ["$totalMarks", "$totalPossible"] },
                    100,
                  ],
                },
                examsTaken: 1,
                totalAttempts: 1,
              },
            },
          ],
          subjectWiseScores: [
            {
              $unwind: "$obtained",
            },
            {
              $match: { "obtained.studentId": { $in: userObjectIds } },
            },
            {
              $group: {
                _id: "$subject",
                totalMarks: {
                  $sum: {
                    $cond: [
                      { $eq: ["$obtained.marks", -1] },
                      0,
                      "$obtained.marks",
                    ],
                  },
                },
                totalPossible: { $sum: "$total" },
                examsTaken: {
                  $sum: {
                    $cond: [{ $ne: ["$obtained.marks", -1] }, 1, 0],
                  },
                },
                totalAttempts: { $sum: 1 },
              },
            },
            {
              $project: {
                subject: "$_id",
                averageScore: {
                  $multiply: [
                    { $divide: ["$totalMarks", "$totalPossible"] },
                    100,
                  ],
                },
                examsTaken: 1,
                totalAttempts: 1,
              },
            },
          ],
        },
      },
    ]);

    const stats = examStats[0];
    const totalExams = stats.totalExams[0]?.count || 0;
    const averagePerformance = stats.averagePerformance[0] || {
      averagePercentage: 0,
      examsTaken: 0,
      totalAttempts: 0,
    };
    const subjectWiseScores = stats.subjectWiseScores;

    const averageAttendance =
      totalExams > 0
        ? (averagePerformance.examsTaken / averagePerformance.totalAttempts) *
          100
        : 0;

    res.json({
      success: true,
      data: {
        totalExams,
        averagePerformance: averagePerformance.averagePercentage.toFixed(2),
        averageAttendance: 100 - averageAttendance.toFixed(2),
        subjectWiseScores,
        totalStudents,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Add this new endpoint to the existing router in scores.js

router.get("/:id", async (req, res) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate("batchIds")
      .populate("obtained.studentId");
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
      { ...req.body, obtained: obtainedArray },
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
