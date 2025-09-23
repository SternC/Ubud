import express from "express";
import { getUsers, deleteUser, getUserById, updateUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/edit/:id", getUserById);
router.put("/edit/:id", verifyToken, updateUser);
router.get("/delete/:id", deleteUser);
router.get("/profile/", verifyToken, getUserProfile);
router.put("/profile/", verifyToken, updateUserProfile);

export default router;
