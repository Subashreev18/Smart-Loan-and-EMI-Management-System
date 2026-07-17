import Loan from "../models/Loan.js";

const ensureEmiSchedule = (loan) => {
  if (Array.isArray(loan.emiSchedule) && loan.emiSchedule.length > 0) {
    return false;
  }

  const months = Number(loan.tenure || 0);
  const total = Number(loan.totalPayable || 0);
  if (!months || !total) {
    return false;
  }

  const monthlyAmount = Number((total / months).toFixed(2));
  let allocated = 0;
  loan.emiSchedule = Array.from({ length: months }, (_, index) => {
    const isLast = index === months - 1;
    const amount = isLast
      ? Number((total - allocated).toFixed(2))
      : monthlyAmount;
    allocated += amount;
    return {
      month: index + 1,
      amount,
      status: "pending",
      paidDate: null,
    };
  });

  return true;
};

// @desc    Get loan EMI schedule
// @route   GET /api/emi/:loanId
// @access  Protected (owner/admin)
export const getEmiSchedule = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).select(
      "customer emi tenure totalPayable remainingAmount emiSchedule status"
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const isOwner = loan.customer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const wasGenerated = ensureEmiSchedule(loan);
    if (wasGenerated) {
      await loan.save();
    }

    return res.json({
      loanId: loan._id,
      status: loan.status,
      emi: loan.emi,
      totalPayable: loan.totalPayable,
      remainingAmount: loan.remainingAmount,
      emiSchedule: loan.emiSchedule || [],
    });
  } catch (error) {
    console.error("Get EMI schedule error:", error.message);
    return res.status(500).json({ message: "Failed to fetch EMI schedule" });
  }
};

// @desc    Mark EMI month as paid
// @route   PUT /api/emi/pay/:loanId/:month
// @access  Protected (owner/admin)
export const markEmiAsPaid = async (req, res) => {
  try {
    const { loanId, month } = req.params;
    const monthNumber = Number(month);

    if (!monthNumber || monthNumber < 1) {
      return res.status(400).json({ message: "Invalid month value" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const isOwner = loan.customer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    ensureEmiSchedule(loan);

    const scheduleItem = loan.emiSchedule.find((item) => item.month === monthNumber);
    if (!scheduleItem) {
      return res.status(404).json({ message: "EMI month not found" });
    }

    if (scheduleItem.status === "paid") {
      return res.status(400).json({ message: "EMI is already marked as paid" });
    }

    scheduleItem.status = "paid";
    scheduleItem.paidDate = new Date();

    const paidAmount = loan.emiSchedule
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.amount, 0);

    loan.remainingAmount = Math.max(loan.totalPayable - paidAmount, 0);

    if (loan.remainingAmount === 0) {
      loan.status = "completed";
    }

    await loan.save();

    return res.json({
      message: "EMI marked as paid",
      loanId: loan._id,
      remainingAmount: loan.remainingAmount,
      status: loan.status,
      emiSchedule: loan.emiSchedule,
    });
  } catch (error) {
    console.error("Mark EMI error:", error.message);
    return res.status(500).json({ message: "Failed to mark EMI as paid" });
  }
};
