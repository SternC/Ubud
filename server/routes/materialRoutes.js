
import express from "express";
import { createMaterial, listMaterials } from "../controllers/materialController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("coach"), createMaterial);
router.get("/", listMaterials);

export default router;
