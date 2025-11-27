import express from "express";
import { register, login, logout, authentication } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/authentication", verifyToken, authentication);

export default router;