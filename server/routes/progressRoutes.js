import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { markSubcourseDone, markAssignmentDone, getCourseProgress } from "../controllers/progressController.js";
import { getStudentsProgress } from "../controllers/coachProgressController.js";

const router = express.Router();

router.post("/progress/subcourse", verifyToken, markSubcourseDone);
router.post("/progress/assignment", verifyToken, markAssignmentDone);
router.get("/progress/:courseId", verifyToken, getCourseProgress);

router.get("/students-progress", verifyToken, getStudentsProgress);


export default router;