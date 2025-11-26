
import express from "express";
import { createAvailability, listAvailabilities } from "../controllers/availabilityController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("coach"), createAvailability);
router.get("/", listAvailabilities);

export default router;
