import express from "express";
import { getCoachTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/transactions/coach/:coachId", verifyToken, getCoachTransactions);

export default router;