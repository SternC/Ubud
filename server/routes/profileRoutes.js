import express from "express";
import {
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profiles", verifyToken, getProfiles);
router.get("/profiles/:id", verifyToken, getProfileById);
router.put("/profiles", verifyToken, updateProfile);
router.delete("/profiles/:id", verifyToken, deleteProfile);

export default router;