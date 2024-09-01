import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import express from "express";
import { fetchData } from "./statistics";
import { Punch } from "../mongodb/models";

const router = express.Router();

router.get("/absentees", async (req, res) => {
  try {
    const { selectionType, selectedIds, startDate, endDate } = req.query;

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

    res.json({ success: true, data: { absentees } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching absentees", error: error.message });
  }
});

router.get("/presentees", async (req, res) => {
  try {
    const { startDate, endDate, selectionType, selectedIds } = req.query;
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

    const punches = await Punch.find(query).populate("userId", "name");

    // Group punches by user and date
    const presenteesMap = new Map();
    punches.forEach((punch: any) => {
      const key = `${punch.userId._id}_${format(
        punch.timestamp,
        "yyyy-MM-dd"
      )}`;
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

    console.log(presenteesMap);

    const presentees = Array.from(presenteesMap.values());

    res.json({ success: true, data: { presentees } });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching presentees", error: error.message });
  }
});

export default router;
