import Comment from "../models/Comment.js";

// Create comment
export const addComment = async (req, res) => {
  try {
    const { content, materialId, assignmentId, userId } = req.body;

    const comment = await Comment.create({
      content,
      materialId: materialId || null,
      assignmentId: assignmentId || null,
      userId,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get comments for material or assignment
export const getComments = async (req, res) => {
  try {
    const { materialId, assignmentId } = req.query;

    const where = {};
    if (materialId) where.materialId = materialId;
    if (assignmentId) where.assignmentId = assignmentId;

    const comments = await Comment.findAll({ where, order: [["createdAt", "ASC"]] });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
