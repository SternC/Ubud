import express from "express";
import { createPurchase, getUserPurchases, getTransactions, downloadReceipt,getAllPurchases,deletePurchase, downloadPurchaseReport, getCoachTransactions} from "../controllers/PurchaseController.js"; 
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/purchase", (req, res, next) => {
  console.log("🔥 /purchase route hit");
  next();
}, createPurchase);

router.get("/purchases/download-report", downloadPurchaseReport);
router.get("/purchases/:userId", getUserPurchases);
router.get("/transactions/:userId", getTransactions);

router.get("/transactions/download-receipt/:transactionId", downloadReceipt);
router.delete("/purchases/:id", deletePurchase);
router.get("/purchases", getAllPurchases);
router.get("/courses/coach/transactions", verifyToken, getCoachTransactions);
export default router;