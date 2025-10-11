import express from "express";
import { createPurchase, getUserPurchases, getTransactions, } from "../controllers/PurchaseController.js";

const router = express.Router();

router.post("/api/purchase", createPurchase);
router.get("/api/purchases/:userId", getUserPurchases);
router.get("/api/transactions/:userId", getTransactions);

export default router;
