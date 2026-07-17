import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getEmiSchedule, markEmiAsPaid } from "../controllers/emiController.js";

const router = express.Router();

router.get("/:loanId", protect, getEmiSchedule);
router.put("/pay/:loanId/:month", protect, markEmiAsPaid);

export default router;
