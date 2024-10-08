import express from "express";
import { Punch, User, Batch, Holiday } from "../mongodb/models";
import { endOfDay, format, parse, parseISO, startOfDay } from "date-fns";
import { type ObjectId } from "mongoose";
import { eachDayOfInterval, isSameDay } from "date-fns";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { selectionType, selectedIds, startDate, endDate } = req.query;
    const start = startOfDay(startDate as string).toISOString();

    const end = endOfDay(endDate as string).toISOString();

    const {
      userIds,
      batchIds,
      punches,
      holidays,
      users,
      holidayFor,
      absentUsersByDate,
    } = await fetchData(
      selectionType as string,
      selectedIds as string,
      start as string,
      end as string
    );

    const stats = await calculateStatistics(
      punches,
      holidays,
      new Date(start as string),
      new Date(end as string),
      userIds,
      users
    );

    const holidayStudents = Object.values(
      Object.fromEntries(holidayFor)
    ).flatMap((_) => _).length;
    const absent = Object.values(Object.fromEntries(absentUsersByDate)).flatMap(
      (_) => _
    ).length;

    res.json({
      success: true,
      data: { stats: { ...stats, holidayStudents, absent } },
    });
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
    const { selectionType = 'all', selectedIds, startDate, endDate } = req.query;
    const start = startOfDay(startDate as string).toISOString();

    const end = endOfDay(endDate as string).toISOString();
    const { batchIds, holidays } = await fetchData(
      selectionType as string,
      selectedIds as string,
      start as string,
      end as string
    );

    res.json({ success: true, data: { holidays } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching holidays", error: error.message });
  }
});

router.get("/holidayFor", async (req, res) => {
  try {
    const { 
      selectionType = 'all', 
      selectedIds, 
      startDate, 
      endDate, 
      page = 1, 
      rows = 10,
      search = ""
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(rows as string);

    const start = startOfDay(new Date(startDate as string)).toISOString();
    const end = endOfDay(new Date(endDate as string)).toISOString();
    console.log(start, end);

    const { holidayFor } = await fetchData(
      selectionType as string,
      selectedIds as string,
      start,
      end
    );

    let holidayFor_ = Object.keys(Object.fromEntries(holidayFor)).flatMap(
      (key) => [
        ...Object.fromEntries(holidayFor)[key].map((obj) => ({
          ...obj._doc,
          date: parse(key, "dd-MM-yyyy", new Date()),
        })),
      ]
    );

    // Apply search filter if provided
    if (search) {
      holidayFor_ = holidayFor_.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.reason.toLowerCase().includes(search.toLowerCase())
      );
    }

    const count = holidayFor_.length;
    const pages = Math.ceil(count / limitNumber);

    // Apply pagination
    const paginatedHolidayFor = holidayFor_.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    res.json({
      success: true,
      data: { holidayFor: paginatedHolidayFor },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching holiday users", error: error.message });
  }
});

export async function fetchData(
  selectionType: string,
  selectedIds: string,
  startDate?: string,
  endDate?: string
) {
  let userIds: string[] = [];
  let batchIds: string[] = [];
  let users: any[] = [];

  if (selectionType === "all") {
    users = await User.find();
    userIds = users.map((user) => user._id.toString());
    batchIds = users.flatMap((user) =>
      user.batchIds.map((id: any) => id.toString())
    );
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

  if (!startDate && !endDate)
    return {
      userIds,
      batchIds,
      users,
    };

  const start = startOfDay(parseISO(startDate as string));
  const end = endOfDay(parseISO(endDate as string));
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
    deleted: false,
  });

  const absentUsersByDate = new Map();
  let holidayFor: Map<string, any[]> = new Map();
  eachDayOfInterval({ start, end }).forEach((currentDate) => {
    const punchesForDay = punches.filter((punch) =>
      isSameDay(new Date(punch.timestamp), currentDate)
    );

    const presentUserIds = new Set(
      punchesForDay.map((punch) => punch.userId.toString())
    );

    const absentUsers = [];

    for (const user of users) {
      if (presentUserIds.has(user._id.toString())) {
        continue;
      }

      const isHoliday = holidays.some((holiday) => {
        if (isSameDay(holiday.date, currentDate)) {
          if (holiday.all) {
            return true;
          }
          if (holiday.userIds.includes(user._id.toString())) {
            return true;
          }
          if (holiday.batchIds.length > 0) {
            const considerHoliday = user.batchIds.every((batchId: ObjectId) =>
              holiday.batchIds.includes(batchId.toString())
            );
            return considerHoliday;
          }
        }
        return false;
      });

      if (!isHoliday) {
        absentUsers.push(user);
      } else {
        const last = holidayFor.get(format(currentDate, "dd-MM-yyyy")) || [];
        holidayFor.set(format(currentDate, "dd-MM-yyyy"), [...last, user]);
      }
    }
    absentUsersByDate.set(currentDate.toISOString().split("T")[0], absentUsers);
  });

  return {
    userIds,
    batchIds,
    punches,
    holidays,
    holidayFor,
    absentUsersByDate,
    users,
  };
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
