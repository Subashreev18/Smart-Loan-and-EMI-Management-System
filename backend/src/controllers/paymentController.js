import Payment from "../models/Payment.js";
import Loan from "../models/Loan.js";

// @desc    Make a payment against a loan
// @route   POST /api/payments
// @access  Customer
export const makePayment = async (req, res) => {
  try {
    const { loanId, amountPaid, paymentMode } = req.body;

    if (!loanId || !amountPaid) {
      return res.status(400).json({ message: "Loan ID and amount are required" });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Loan is not approved for payments" });
    }

    if (amountPaid > loan.remainingAmount) {
      return res
        .status(400)
        .json({ message: "Payment exceeds remaining loan amount" });
    }

    // Create payment
    const payment = await Payment.create({
      loan: loan._id,
      amountPaid,
      paymentMode,
    });

    // Update remaining amount
    loan.remainingAmount -= amountPaid;

    // Auto-complete loan
    if (loan.remainingAmount === 0) {
      loan.status = "completed";
    }

    await loan.save();

    res.status(201).json({
      message: "Payment successful",
      payment,
      remainingAmount: loan.remainingAmount,
      loanStatus: loan.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

// @desc    Get payments for a loan
// @route   GET /api/payments/:loanId
// @access  Protected
export const getPaymentsByLoan = async (req, res) => {
  try {
    const payments = await Payment.find({ loan: req.params.loanId }).sort({
      createdAt: -1,
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
