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
});

const User = mongoose.model("User", UserSchema);

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

export { Batch, User, Template, Holiday, Punch, Message, NewCard };
