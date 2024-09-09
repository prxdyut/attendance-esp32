import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import express from "express";
import { fetchData } from "./statistics";
import { Punch } from "../mongodb/models";

const router = express.Router();

router.get("/absentees", async (req, res) => {
  try {
    const { selectionType= 'all', selectedIds, startDate, endDate, page = 1, rows = 10 } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(rows as string);

    const start = startOfDay(startDate as string).toISOString();
    const end = endOfDay(endDate as string).toISOString();

    const { absentUsersByDate } = await fetchData(
      selectionType as string,
      selectedIds as string,
      start as string,
      end as string
    );

    const absentees = Object.keys(
      Object.fromEntries(absentUsersByDate)
    ).flatMap((key) => [
      ...Object.fromEntries(absentUsersByDate)[key].map((obj: any) => ({
        ...obj._doc,
        date: key,
      })),
    ]);

    // Calculate pagination
    const totalCount = absentees.length;
    const totalPages = Math.ceil(totalCount / limitNumber);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    // Slice the absentees array for pagination
    const paginatedAbsentees = absentees.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: { absentees: paginatedAbsentees },
      pagination: {
        current: pageNumber,
        total: totalPages,
        rows: limitNumber,
        count: totalCount,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching absentees", error: error.message });
  }
});

router.get("/presentees", async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      selectionType = "all", 
      selectedIds,
      page = 1,
      rows = 10
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(rows as string);

    const start = startOfDay(parseISO(startDate as string));
    const end = endOfDay(parseISO(endDate as string));

    const { userIds, holidayFor } = await fetchData(
      selectionType as string,
      selectedIds as string,
      startDate as string,
      endDate as string
    );

    const query: any = {
      userId: { $in: userIds },
      timestamp: {
        $gte: start,
        $lte: end,
      },
    };
    
    // Fetch all punches within the date range
    const punches = await Punch.find(query).populate("userId", "name").sort({ timestamp: 1 });

    // Group punches by user and date
    const presenteesMap = new Map();
    punches.forEach((punch: any) => {
      const key = `${punch.userId._id}_${format(punch.timestamp, "yyyy-MM-dd")}`;
      if (!presenteesMap.has(key)) {
        presenteesMap.set(key, {
          name: punch.userId.name,
          date: format(punch.timestamp, "yyyy-MM-dd"),
          hasHoliday: Object.fromEntries(holidayFor)[format(punch.timestamp, "dd-MM-yyyy")],
          punchTimes: [],
        });
      }
      presenteesMap.get(key).punchTimes.push(punch.timestamp);
    });

    const allPresentees = Array.from(presenteesMap.values());

    // Calculate pagination
    const count = allPresentees.length;
    const totalPages = Math.ceil(count / limitNumber);

    // Apply pagination to the grouped data
    const paginatedPresentees = allPresentees.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    res.json({ 
      success: true, 
      data: { presentees: paginatedPresentees },
      pagination: {
        current: pageNumber,
        total: totalPages,
        rows: limitNumber,
        count,
      }
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching presentees", error: error.message });
  }
});

export default router;
