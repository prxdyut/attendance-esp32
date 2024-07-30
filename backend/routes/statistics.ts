import express from "express";
import { Punch, User, Batch, Holiday } from "../mongodb/models";
import { addDays, endOfDay, parseISO, startOfDay } from "date-fns";
import mongoose from "mongoose";
import { eachDayOfInterval, isSameDay } from "date-fns";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { selectionType, selectedIds, startDate, endDate } = req.query;
    const { userIds, batchIds, punches, holidays, users } = await fetchData(
      selectionType as string,
      selectedIds as string,
      startDate as string,
      endDate as string
    );

    const stats = await calculateStatistics(
      punches,
      holidays,
      new Date(startDate as string),
      new Date(endDate as string),
      userIds,
      users
    );
    console.log(stats);

    res.json({ success: true, data: { stats } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
});

router.get("/present", async (req, res) => {
  try {
    const { selectionType, selectedIds, date } = req.query;
    const { userIds, punches } = await fetchData(
      selectionType as string,
      selectedIds as string,
      date as string,
      date as string
    );

    const presentUsers = punches.map((punch) => punch.userId);
    res.json({ success: true, data: { presentUsers } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching present users", error: error.message });
  }
});

router.get("/absent", async (req, res) => {
  try {
    const { selectionType, selectedIds, startDate, endDate } = req.query;

    const { absentUsersByDate } = await fetchData(
      selectionType as string,
      selectedIds as string,
      startDate as string,
      endDate as string
    );

    res.json({
      success: true,
      data: { absentUsersByDate: Object.fromEntries(absentUsersByDate) },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching absent users", error: error.message });
  }
});

router.get("/holidays", async (req, res) => {
  try {
    const { selectionType, selectedIds, startDate, endDate } = req.query;
    const { batchIds, holidays } = await fetchData(
      selectionType as string,
      selectedIds as string,
      startDate as string,
      endDate as string
    );

    res.json({ success: true, data: { holidays } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching holidays", error: error.message });
  }
});

export async function fetchData(
  selectionType: string,
  selectedIds: string,
  startDate: string,
  endDate: string
) {
  let userIds: string[] = [];
  let batchIds: string[] = [];
  let users: any[] = [];
  const start = startOfDay(addDays(parseISO(startDate as string), 1));
  const end = endOfDay(addDays(parseISO(endDate as string), 1));

  if (selectionType === "all") {
    users = await User.find();
    userIds = users.map((user) => user._id.toString());
    batchIds = users.map((batch) => batch._id.toString());
  } else if (selectionType === "userIds") {
    userIds = selectedIds.split(",");
    users = await User.find({ _id: userIds });
    batchIds = users.flatMap((user) =>
      user.batchIds.map((id: any) => id.toString())
    );
  } else if (selectionType === "batchIds") {
    batchIds = selectedIds.split(",");
    users = await User.find({ batchIds: { $in: batchIds } });
    userIds = users.map((user) => user._id.toString());
  }

  const query: any = {
    userId: userIds,
    timestamp: {
      $gte: start,
      $lte: end,
    },
  };

  const punches = await Punch.find(query).populate("_id");

  const holidays = await Holiday.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
    $or: [
      { all: true },
      { userIds: { $in: userIds } },
      { batchIds: { $in: batchIds } },
    ],
  });

  // Fetch all users with their batch IDs
  // const users = await User.find({ _id: { $in: userIds } }).select(
  //   "_id name email batchIds"
  // );

  const absentUsersByDate = new Map();

  eachDayOfInterval({ start, end }).forEach((currentDate) => {
    // Filter punches for the current date
    const punchesForDay = punches.filter((punch) =>
      isSameDay(new Date(punch.timestamp), currentDate)
    );

    // Convert punches to a Set for faster lookup
    const presentUserIds = new Set(
      punchesForDay.map((punch) => punch.userId.toString())
    );

    const absentUsers = [];

    for (const user of users) {
      // Check if the user has a punch for the day
      if (presentUserIds.has(user._id.toString())) {
        continue; // User was present, skip to next user
      }

      // Check if it's a holiday for this user
      const isHoliday = holidays.some(
        (holiday) =>
          isSameDay(holiday.date, currentDate) &&
          (holiday.all ||
            holiday.userIds.includes(user._id.toString()) ||
            holiday.batchIds.some((batchId) => user.batchIds.includes(batchId)))
      );

      if (!isHoliday) {
        // If it's not a holiday for this user and they don't have a punch, mark them as absent
        absentUsers.push(user);
      }
    }

    absentUsersByDate.set(currentDate.toISOString().split("T")[0], absentUsers);
  });

  return { userIds, batchIds, punches, holidays, absentUsersByDate, users };
}

async function calculateStatistics(
  punches: any[],
  holidays: any[],
  startDate: Date,
  endDate: Date,
  userIds: string[],
  users: any[]
) {
  const present = new Set();
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
  let workingDays = 0;
  let totalAbsences = 0;
  let totalHolidayStudents = 0;

  const userBatchMap = new Map(
    users.map((user) => [user._id.toString(), user.batchIds])
  );

  const punchesByDate = new Map();
  punches.forEach((punch) => {
    const userId = punch.userId._id.toString();
    const punchDate = new Date(punch.timestamp);
    const dateString = punchDate.toISOString().split("T")[0];

    if (!punchesByDate.has(dateString)) {
      punchesByDate.set(dateString, new Map());
    }
    if (!punchesByDate.get(dateString).has(userId)) {
      punchesByDate.get(dateString).set(userId, []);
    }
    punchesByDate.get(dateString).get(userId).push(punch);

    present.add(userId);
  });

  daysInRange.forEach((day) => {
    const dateString = day.toISOString().split("T")[0];
    const applicableHolidays = holidays.filter((holiday) =>
      isSameDay(holiday.date, day)
    );

    const studentsOnHoliday = new Set();
    applicableHolidays.forEach((holiday) => {
      if (holiday.all) {
        userIds.forEach((userId) => studentsOnHoliday.add(userId));
      } else {
        holiday.userIds.forEach((id: any) =>
          studentsOnHoliday.add(id.toString())
        );
        holiday.batchIds.forEach((batchId: any) => {
          userIds.forEach((userId) => {
            const userBatchIds = userBatchMap.get(userId);
            if (userBatchIds && userBatchIds.includes(batchId)) {
              studentsOnHoliday.add(userId);
            }
          });
        });
      }
    });

    totalHolidayStudents += studentsOnHoliday.size;

    if (studentsOnHoliday.size < userIds.length) {
      workingDays++;
      const presentToday = punchesByDate.get(dateString) || new Map();
      userIds.forEach((userId) => {
        if (!presentToday.has(userId) && !studentsOnHoliday.has(userId)) {
          totalAbsences++;
        }
      });
    }
  });

  return {
    present: present.size,
    absent: totalAbsences,
    totalDays: daysInRange.length,
    workingDays,
    holidayStudents: totalHolidayStudents,
  };
}

export default router;
