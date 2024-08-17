import express from "express";
import mongoose from "mongoose";
import batchRoutes from "./routes/batch";
import userRoutes from "./routes/user";
import templateRoutes from "./routes/template";
import holidayRoutes from "./routes/holiday";
import punchRoutes from "./routes/punch";
import whatsappRoutes from "./routes/whatsapp";
import statisticsRoutes from "./routes/statistics"; // Import the statisticsRoutes
import scheduleRoutes from "./routes/schedules";
import scoresRoutes from "./routes/scores";
import feesRoutes from "./routes/fees";
import resourceRoutes from "./routes/resources";
import uploadsRoutes from "./routes/uploads";
import alertRoutes from "./routes/alerts";

import cors from "cors";
import { Server } from "socket.io";
import { whatsappSocket } from "./routes/websockets/whatsapp";
import { setupWebsocket } from "./utils/ssetupWebSocket";

const app = express();
const PORT = process.env.PORT || 3000;
const socket = new Server(4000, {
  path: "/",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:22222/databse")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", express.static("public"));
app.use("/api/batches", batchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/punches", punchRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/scores", scoresRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/alerts", alertRoutes);

export const whatsappWebsocket = setupWebsocket(
  "/whatsApp",
  socket,
  whatsappSocket
);

export const punchesWebsocket = setupWebsocket("/punches", socket, () => {});

console.log("Socket.IO server is running on port 4000");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
