
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMaterial.js";
import {
  createSubcourse,
  getSubcourses,
  uploadFileMaterial,
  uploadYoutubeMaterial,
  getMaterials,
  deleteMaterial,
  renameMaterial,
  reorderMaterials,
  addComment,
  getComments
} from "../controllers/subcourseController.js";

const router = express.Router();

router.post("/courses/:id/subcourses", verifyToken, createSubcourse);
router.get("/courses/:id/subcourses", verifyToken, getSubcourses);

// Upload file(s) - single or multiple: backend accepts single here, frontend can post multiple separately
router.post("/subcourses/:id/materials", verifyToken, upload.single("file"), uploadFileMaterial);

// Youtube add
router.post("/subcourses/:id/youtube", verifyToken, uploadYoutubeMaterial);

// Get materials list
router.get("/subcourses/:id/materials", verifyToken, getMaterials);

// Delete material
router.delete("/materials/:id", verifyToken, deleteMaterial);

// Rename / update material
router.put("/materials/:id", verifyToken, renameMaterial);

// Reorder materials
router.put("/subcourses/:id/materials/reorder", verifyToken, reorderMaterials);

// Comments
router.post("/materials/:id/comments", verifyToken, addComment);
router.get("/materials/:id/comments", verifyToken, getComments);

export default router;