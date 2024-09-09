import express from "express";
import { NewCard, Punch, User } from "../mongodb/models";
import { addMessageToQueue } from "./whatsapp";
import { getMessage } from "../utils/message";
import { fetchData } from "./statistics";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { punchesWebsocket } from "..";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const params = new URL(url).searchParams;

    let uids: any = params.get("uids") as string;
    const uid = params.get("uid") as string;
    let timestamps: any = params.get("timestamps") as string;
    const timestamp = params.get("timestamp") as string;
    const multiple = params.has("multiple");
    let results;

    if (multiple) {
      uids = uids.split(",");
      timestamps = timestamps.split(",");

      results = await Promise.all(
        uids.map((uid: string, index: number) =>
          processPunch(uid, new Date(timestamps[index]))
        )
      );
      res.send("success");
    } else {
      results = await processPunch(uid, new Date(timestamp));
      res.send("success");
    }
    console.log(results);
  } catch (error: any) {
    console.error("Error processing punches:", error.message);
    res.status(400).send("error");
  }
});

async function processPunch(uid0: string, timestamp: Date) {
  let uid = uid0[0] == "P" ? uid0.slice(1) : uid0;
  const user = await User.findOne({ cardUid: uid });

  if (user) {
    const startOfDay = new Date(timestamp);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(timestamp);
    endOfDay.setHours(23, 59, 59, 999);

    const punchesToday = await Punch.find({
      userId: user._id,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const firstPunch = punchesToday.length == 0;
    const secondPunch = punchesToday.length == 1;
    const morePunch = punchesToday.length >= 2;

    const existingPunch = await Punch.findOne({
      userId: user._id,
      timestamp: {
        $gte: new Date(timestamp.getTime() - 1000), // 1 second before
        $lte: new Date(timestamp.getTime() + 1000), // 1 second after
      },
    });

    if (existingPunch) {
      console.warn("Duplicate punch detected:", existingPunch);
      return { status: "success", message: "Punch was already recorded", uid };
    }

    const punch = new Punch({ userId: user._id, timestamp });
    await punch.save();

    if (firstPunch) {
      addMessageToQueue({
        message: getMessage({
          eventType: "punchIn",
          studentId: user._id.toString(),
          studentName: user.name,
          timestamp,
        }),
        userId: user._id.toString(),
      });
    } else if (secondPunch)
      addMessageToQueue({
        message: getMessage({
          eventType: "punchOut",
          studentId: user._id.toString(),
          studentName: user.name,
          timestamp,
        }),
        userId: user._id.toString(),
      });
    else if (morePunch)
      addMessageToQueue({
        message: getMessage({
          eventType: "punch",
          studentId: user._id.toString(),
          studentName: user.name,
          timestamp,
        }),
        userId: user._id.toString(),
      });
    punchesWebsocket.emit("cardPunch", [
      {
        name: user.name,
        uid,
        time: format(timestamp, "h:mm a"),
      },
    ]);
    return { status: "success", message: "Punch recorded", uid };
  } else {
    const existingPunch = await NewCard.findOne({
      uid,
      timestamp: {
        $gte: new Date(timestamp.getTime() - 1000), // 1 second before
        $lte: new Date(timestamp.getTime() + 1000), // 1 second after
      },
    });

    if (existingPunch) {
      console.warn("Duplicate new punch detected:", existingPunch);
      return {
        status: "success",
        message: "New Punch was already recorded",
        uid,
      };
    }

    const newCard = new NewCard({ uid, timestamp });
    console.log(uid, timestamp);
    await newCard.save();

    return { status: "warning", message: "Unrecognized card recorded", uid };
  }
}

// Object to store IDs of users who have received an absent message, keyed by date
let absentMessagesSent = {
  date: "",
  users: new Set(),
};

// Function to reset absentMessagesSent if it's a new day
function resetIfNewDay() {
  const today = new Date().toISOString().split("T")[0];
  if (today !== absentMessagesSent.date) {
    absentMessagesSent = {
      date: today,
      users: new Set(),
    };
  }
}

router.get("/absent", async (req, res) => {
  try {
    resetIfNewDay();

    const { absentUsersByDate } = await fetchData(
      "all",
      "",
      new Date().toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );

    const today = new Date().toISOString().split("T")[0];
    const absentUsers = absentUsersByDate.get(today) || [];

    const notifiedUsers = absentUsers.filter((user: any) => {
      const userId = user._id.toString();
      if (!absentMessagesSent.users.has(userId)) {
        console.log(`Notifying ${user.name} of absence`, user);
        addMessageToQueue({
          message: getMessage({
            eventType: "absent",
            studentId: user.cardUid,
            studentName: user.name,
            timestamp: new Date(),
          }),
          userId: userId,
        });
        absentMessagesSent.users.add(userId);
        return true;
      }
      return false;
    });

    console.log(`${notifiedUsers.length} absentees notified`);
    res.json({
      success: true,
      data: {
        absentUsersByDate: Object.fromEntries(absentUsersByDate),
        notifiedUsers: notifiedUsers.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/new", async (req, res) => {
  const { startDate, endDate, page = 1, rows = 10, search = "" } = req.query;
  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(rows as string);

  try {
    const query: any = {};

    if (startDate && endDate) {
      query.timestamp = {
        $gte: startOfDay(new Date(startDate as string)),
        $lte: endOfDay(new Date(endDate as string)),
      };
    }

    if (search) {
      query.$or = [{ uid: { $regex: search, $options: "i" } }];
    }

    const count = await NewCard.countDocuments(query);
    const pages = Math.ceil(count / limitNumber);

    const newCards = await NewCard.find(query)
      .sort({ timestamp: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: true,
      data: {
        newCards,
      },
      pagination: {
        current: pageNumber,
        total: pages,
        rows: limitNumber,
        count,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
