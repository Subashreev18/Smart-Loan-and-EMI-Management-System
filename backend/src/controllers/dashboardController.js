import Loan from "../models/Loan.js";
import Payment from "../models/Payment.js";

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();

    const approvedLoans = await Loan.countDocuments({
      status: "approved",
    });

    const pendingLoans = await Loan.countDocuments({
      status: "pending",
    });

    const completedLoans = await Loan.countDocuments({
      status: "completed",
    });

    const totalDisbursed = await Loan.aggregate([
      { $match: { status: { $in: ["approved", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCollected = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    ]);

    res.json({
      totalLoans,
      approvedLoans,
      pendingLoans,
      completedLoans,
      totalDisbursed: totalDisbursed[0]?.total || 0,
      totalCollected: totalCollected[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
