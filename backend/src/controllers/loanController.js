import Loan from "../models/Loan.js";
import { calculateEMI } from "../services/emiCalculator.js";

const buildEmiSchedule = (totalPayable, tenure) => {
  const total = Number(totalPayable);
  const months = Number(tenure);

  if (!total || !months) {
    return [];
  }

  const monthlyAmount = Number((total / months).toFixed(2));
  let allocated = 0;

  return Array.from({ length: months }, (_, index) => {
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
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Customer
export const createLoan = async (req, res) => {
  try {
    const { amount, interestRate, tenure } = req.body;

    if (!amount || !interestRate || !tenure) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emi = calculateEMI(amount, interestRate, tenure);
    const totalPayable = emi * tenure;
    const remainingAmount = totalPayable;
    const emiSchedule = buildEmiSchedule(totalPayable, tenure);

    const loan = await Loan.create({
      customer: req.user._id,
      amount,
      interestRate,
      tenure,
      emi,
      totalPayable,
      remainingAmount,
      emiSchedule,
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error("Create loan error:", error.message);
    res.status(500).json({ message: "Failed to create loan" });
  }
};

// @desc    Approve or reject loan
// @route   PUT /api/loans/:id/status
// @access  Admin / Agent
export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = status;
    loan.approvedBy = req.user._id;
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update loan status" });
  }
};

// @desc    Get loans
// @route   GET /api/loans
// @access  All (role-based)
export const getLoans = async (req, res) => {
  try {
    let loans;

    if (req.user.role === "customer") {
      loans = await Loan.find({ customer: req.user._id });
    } else {
      loans = await Loan.find().populate("customer", "name email");
    }

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

// @desc    Delete loan
// @route   DELETE /api/loans/:id
// @access  Owner or Admin
export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const isOwner = loan.customer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await loan.deleteOne();
    return res.json({ message: "Loan deleted successfully", loanId: req.params.id });
  } catch (error) {
    console.error("Delete loan error:", error.message);
    return res.status(500).json({ message: "Failed to delete loan" });
  }
};
