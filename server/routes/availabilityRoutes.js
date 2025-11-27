import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js"; // Sesuaikan path middleware
import { addAvailability, getCoachAvailability } from "../controllers/availabilityController.js";

const router = express.Router();

// Coach menambah jadwal (Butuh Login)
router.post("/", verifyToken, addAvailability);

// Public melihat jadwal coach (Tidak harus login, atau terserah logicmu)
router.get("/:coachId", getCoachAvailability);

export default router;