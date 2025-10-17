import express from "express";
import { createPurchase, getUserPurchases, getTransactions, downloadReceipt } from "../controllers/PurchaseController.js"; 

const router = express.Router();

router.post("/api/purchase", createPurchase);
router.get("/api/purchases/:userId", getUserPurchases);
router.get("/api/transactions/:userId", getTransactions);

router.get("/api/transactions/download-receipt/:transactionId", downloadReceipt);

export default router;