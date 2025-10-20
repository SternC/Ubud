import express from "express";
import { createPurchase, getUserPurchases, getTransactions, downloadReceipt,getAllPurchases,deletePurchase, downloadPurchaseReport} from "../controllers/PurchaseController.js"; 
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/purchase", (req, res, next) => {
  console.log("🔥 /api/purchase route hit");
  next();
}, createPurchase);

router.get("/purchases/download-report", downloadPurchaseReport);
router.get("/purchases/:userId", getUserPurchases);
router.get("/transactions/:userId", getTransactions);

router.get("/api/transactions/download-receipt/:transactionId", downloadReceipt);
router.delete("/purchases/:id", deletePurchase);
router.get("/purchases", getAllPurchases);
export default router;