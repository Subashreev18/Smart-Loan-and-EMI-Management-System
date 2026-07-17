import mongoose from "mongoose";

const emiScheduleSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const loanSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number, // in months
      required: true,
    },
    emi: {
      type: Number,
      required: true,
    },
    totalPayable: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    emiSchedule: [emiScheduleSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
