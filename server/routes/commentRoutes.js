
import express from "express";
import { createComment } from "../controllers/commentController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createComment);

export default router;
