import mongoose from "mongoose";
const { Schema } = mongoose;

const NewCardSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const NewCard = mongoose.model("NewCard", NewCardSchema);

const BatchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Batch = mongoose.model("Batch", BatchSchema);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  batchIds: {
    type: [Schema.Types.ObjectId],
    ref: "Batch",
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "faculty"],
    required: true,
  },
  cardUid: {
    type: String,
    unique: true,
    required: true,
  },
  totalFees: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPaid: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User = mongoose.model("User", UserSchema);

const FeeInstallmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  refNo: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const FeeInstallment = mongoose.model("FeeInstallment", FeeInstallmentSchema);

const TemplateSchema = new Schema({
  uname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
});

const Template = mongoose.model("Template", TemplateSchema);

const HolidaySchema = new Schema({
  batchIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  all: {
    type: Boolean,
    default: false,
  },
  event: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Holiday = mongoose.model("Holiday", HolidaySchema);

const PunchSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const Punch = mongoose.model("Punch", PunchSchema);

const MessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  message: { type: String, required: true },
  failed: { type: Boolean, default: true },
  screen: { type: String, required: false },
  error: { type: String, required: false },
});

const Message = mongoose.model("Message", MessageSchema);

const scheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  batchIds: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

const ScoreSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  obtained: [
    {
      studentId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  batchIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
  ],
});

const Score = mongoose.model("Score", ScoreSchema);

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  batchIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  all: {
    type: Boolean,
    default: false,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model("Resource", ResourceSchema);

const AlertSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  batchIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  all: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.model("Alert", AlertSchema);

export {
  Alert,
  Batch,
  User,
  Template,
  Holiday,
  Punch,
  Message,
  NewCard,
  Schedule,
  Score,
  FeeInstallment,
  Resource,
};
