import express from "express";
import { getCourses, getCourseById } from "../controllers/CourseController.js";

const router = express.Router();

router.get("/courses", getCourses);
router.get("/courses/:id", getCourseById);

export default router;

