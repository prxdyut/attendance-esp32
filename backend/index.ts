import express from "express";
import mongoose from "mongoose";
import batchRoutes from "./routes/batch";
import userRoutes from "./routes/user";
import templateRoutes from "./routes/template";
import holidayRoutes from "./routes/holiday";
import punchRoutes from "./routes/punch";
import whatsappRoutes from "./routes/whatsapp";
import statisticsRoutes from "./routes/statistics"; // Import the statisticsRoutes

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017")
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
app.use("/punch", punchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
