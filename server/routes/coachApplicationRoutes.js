
import express from "express";
import { submitApplication, listApplications, getApplication } from "../controllers/coachApplicationController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/submit", authMiddleware, submitApplication);
router.get("/", authMiddleware, requireRole("admin"), listApplications);
router.get("/:id", authMiddleware, requireRole("admin"), getApplication);

export default router;
