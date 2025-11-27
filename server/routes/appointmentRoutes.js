import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { bookAppointment, getMyAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// Student booking jadwal (Butuh Login)
router.post("/", verifyToken, bookAppointment);

// Student melihat jadwal saya (Butuh Login)
router.get("/my-appointments", verifyToken, getMyAppointments);

export default router;