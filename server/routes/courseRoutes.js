import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { uploadCourseMaterial } from "../controllers/CourseController.js";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getPurchasedCourses
} from "../controllers/CourseController.js";


const router = express.Router();

router.get("/courses", verifyToken, getCourses);
router.get("/courses/purchased", verifyToken, getPurchasedCourses); // move this above :id
router.get("/courses/:id", verifyToken, getCourseById);
router.post("/courses", verifyToken, createCourse);
router.put("/courses/:id", verifyToken, updateCourse);
router.delete("/courses/:id", verifyToken, deleteCourse);




export default router;
