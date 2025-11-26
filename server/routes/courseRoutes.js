
import express from "express";
import { createCourse, getCourse, listCourses } from "../controllers/CourseController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("coach"), createCourse);
router.get("/", listCourses);
router.get("/:id", getCourse);

export default router;
