// routes/fees.ts

import express from "express";
import { User, FeeInstallment } from "../mongodb/models";

const router = express.Router();

// Get fee statistics
router.get("/statistics", async (req, res) => {
  try {
    const totalFees = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: null, total: { $sum: "$totalFees" } } },
    ]);

    const paidFees = await FeeInstallment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalFeeAmount = totalFees[0]?.total || 0;
    const paidFeeAmount = paidFees[0]?.total || 0;
    const remainingFeeAmount = totalFeeAmount - paidFeeAmount;

    res.json({
      success: true,
      data: {
        totalFees: totalFeeAmount,
        paidFees: paidFeeAmount,
        remainingFees: remainingFeeAmount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get defaulters
router.get("/defaulters", async (req, res) => {
  try {
    const defaulters = await User.aggregate([
      { $match: { role: "student" } },
      {
        $lookup: {
          from: "feeinstallments",
          localField: "_id",
          foreignField: "userId",
          as: "installments",
        },
      },
      {
        $addFields: {
          paidAmount: { $sum: "$installments.amount" },
          remainingAmount: {
            $subtract: ["$totalFees", { $sum: "$installments.amount" }],
          },
        },
      },
      { $match: { remainingAmount: { $gt: 0 } } },
      {
        $project: { name: 1, totalFees: 1, paidAmount: 1, remainingAmount: 1 },
      },
    ]);

    res.json({ success: true, data: { defaulters } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update fee installment
router.post("/installment", async (req, res) => {
  try {
    const { userIds } = req.body;

    const installment = new FeeInstallment({
      userId: userIds,
      ...req.body,
    });
    await installment.save();

    const user = await User.findById(userIds);
    if (user) {
      user.totalPaid += req.body.amount;
      await user.save();
    }

    res.json({ success: true, data: { installment } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/set-total-fees", async (req, res) => {
  try {
    const { userIds, totalFees } = req.body;

    if (!userIds || !totalFees) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User ID and total fees are required",
        });
    }

    const user = await User.findById(userIds);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.totalFees = totalFees;
    await user.save();

    res.json({ success: true, data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/student/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const installments = await FeeInstallment.find({ userId }).sort({
      date: -1,
    });

    const totalPaid = installments.reduce(
      (sum, installment) => sum + installment.amount,
      0
    );
    const remainingAmount = user.totalFees - totalPaid;

    res.json({
      success: true,
      data: {
        studentName: user.name,
        totalFees: user.totalFees,
        totalPaid,
        remainingAmount,
        installments,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
