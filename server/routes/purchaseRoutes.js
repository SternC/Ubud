import express from "express";

import { createPurchase } from "../controllers/PurchaseController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, createPurchase);
export default router;
