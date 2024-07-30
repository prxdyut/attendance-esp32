import express from "express";
import { NewCard, Punch, User } from "../mongodb/models";
import { addMessageToQueue } from "./whatsapp";
import { getMessage } from "../utils/message";
import { fetchData } from "./statistics";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { uid, timestamp, multiple } = req.query as {
      uid: string;
      timestamp: string;
      multiple: string | undefined;
    };

    if (multiple) {
      const uids = uid.split(",");
      const timestamps = timestamp.split(",");

      const results = await Promise.all(
        uids.map((uid: string, index: number) =>
          processPunch(uid, new Date(timestamps[index]))
        )
      );
      res.status(200).send("success");
    } else {
      const result = await processPunch(uid, new Date(timestamp));
      res.status(200).send("success");
    }
  } catch (error: any) {
    console.error("Error processing punches:", error.message);
    res.status(400).send("error");
  }
});

async function processPunch(uid: string, timestamp: Date) {
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
      throw new Error("Duplicate punch");
    }

    const punch = new Punch({ userId: user._id, timestamp });
    await punch.save();

    if (firstPunch)
      addMessageToQueue({
        message: getMessage({
          eventType: "punchIn",
          studentId: user._id.toString(),
          studentName: user.name,
          timestamp,
        }),
        userId: user._id.toString(),
      });
    else if (secondPunch)
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
      throw new Error("Duplicate New punch");
    }

    const newCard = new NewCard({ uid, timestamp });
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

export default router;
