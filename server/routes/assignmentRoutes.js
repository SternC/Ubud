// routes/assignmentRoutes.js
import express from "express";
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  submitAnswer,
  submitReview
} from "../controllers/assignmentController.js";

const router = express.Router();

// Coach CMS actions
router.post("/:courseId/assignments", createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

// Student routes
router.get("/:courseId/assignments", getAssignmentsByCourse);
router.get("/assignments/:id", getAssignmentById);
router.post("/assignments/:id/answer", submitAnswer);
router.post("/assignments/:id/review", submitReview);

export default router;
