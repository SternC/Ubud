import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { coachApply, getAllCoaches, approveCoach, rejectCoach, getApprovedCoaches} from "../controllers/coachController.js";

const router = express.Router();

router.post("/coach-apply", verifyToken, coachApply);
router.get("/coaches", verifyToken, getAllCoaches);
router.put("/coaches/approve/:id", verifyToken, approveCoach);
router.put("/coaches/reject/:id", verifyToken, rejectCoach);
router.get("/approved-coaches", verifyToken, getApprovedCoaches);

export default router;
