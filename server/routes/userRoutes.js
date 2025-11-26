import express from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  createUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

// Admin: get all users
router.get("/", authMiddleware, getUsers);

// Admin: create user
router.post("/", authMiddleware, createUser);

// Admin: get user by id
router.get("/:id", authMiddleware, getUserById);

// Admin: update user
router.put("/:id", authMiddleware, updateUser);

// Admin: delete user
router.delete("/:id", authMiddleware,    deleteUser);

// Logged-in user: get own profile
router.get("/me/profile", authMiddleware, getUserProfile);

// Logged-in user: update own profile
router.put("/me/profile", authMiddleware, updateUserProfile);

export default router;
