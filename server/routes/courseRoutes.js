import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/courses", verifyToken, getCourses);
router.get("/courses/:id", verifyToken, getCourseById);
router.post("/courses", verifyToken, createCourse);
router.put("/courses/:id", verifyToken, updateCourse);
router.delete("/courses/:id", verifyToken, deleteCourse);

export default router;
