// server/controllers/commentController.js
import models from "../models/index.js";
const { Comment, Material } = models;

export const createComment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const { materialId, content } = req.body;
    if (!materialId || !content) return res.status(400).json({ error: "materialId and content required" });

    const material = await Material.findByPk(materialId);
    if (!material) return res.status(404).json({ error: "Material not found" });

    const comment = await Comment.create({ materialId, userId: user.id, content });
    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("createComment err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

