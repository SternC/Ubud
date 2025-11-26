// server/routes/subcourseRoutes.js
import express from "express";
import { createSubcourse, listSubcourses } from "../controllers/subcourseController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("coach"), createSubcourse);
router.get("/", listSubcourses);

export default router;
