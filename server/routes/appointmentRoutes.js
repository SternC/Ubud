
import express from "express";
import { createAppointment, listAppointmentsForUser, updateAppointmentStatus } from "../controllers/appointmentController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/me", authMiddleware, listAppointmentsForUser);
router.put("/:id", authMiddleware, updateAppointmentStatus); // update status / meeting_link

export default router;
