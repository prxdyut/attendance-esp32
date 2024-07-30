import express from "express";
import { NewCard, User } from "../mongodb/models";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    if (user.cardUid) {
      await NewCard.deleteMany({ uid: user.cardUid });
    }

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully"
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  const { role } = req.query;
  try {
    let users = [];
    switch (role) {
      case "all":
        users = await User.find({role: ["student", "faculty"]});
        break;
      default:
        users = await User.find({ role });
        break;
    }

    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TODO : return statistics data
// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ data: user, success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a user
router.post("/:id/edit", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
