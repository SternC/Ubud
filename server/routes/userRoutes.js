import express from "express";
import { getUsers, deleteUser, getUserById, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/edit/:id", getUserById);
router.put("/edit/:id", verifyToken, updateUser);
router.get("/delete/:id", deleteUser);

export default router;
