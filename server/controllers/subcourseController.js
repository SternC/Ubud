
import Subcourse from "../models/Subcourse.js";
import Material from "../models/Material.js";
import Comment from "../models/Comment.js";
import Course from "../models/Course.js";

export const createSubcourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const subcourse = await Subcourse.create({ title, courseId });
    res.status(201).json(subcourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getSubcourses = async (req, res) => {
  try {
    const courseId = req.params.id;
    const subs = await Subcourse.findAll({ where: { courseId }, order: [["createdAt","ASC"]] });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const uploadFileMaterial = async (req, res) => {
  try {
    const subcourseId = req.params.id;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const maxPosRow = await Material.max("position", { where: { subcourseId } });
    const position = (isNaN(maxPosRow) ? 0 : maxPosRow + 1);

    // Save file info with correct filename
    const material = await Material.create({
      subcourseId,
      type: "file",
      fileUrl: `/uploads/${req.file.filename}`, // use actual saved filename
      originalName: req.file.originalname,
      category: req.body.category || "notes",
      position
    });

    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const uploadYoutubeMaterial = async (req, res) => {
  try {
    const subcourseId = req.params.id;
    const { url, title, category } = req.body;
    if (!url) return res.status(400).json({ message: "YouTube URL required" });

    const maxPosRow = await Material.max("position", { where: { subcourseId } });
    const position = (isNaN(maxPosRow) ? 0 : maxPosRow + 1);

    const material = await Material.create({
      subcourseId,
      type: "youtube",
      youtubeUrl: url,
      originalName: title || "YouTube Video",
      category: category || "video",
      position
    });
    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const subcourseId = req.params.id;
    const mats = await Material.findAll({
      where: { subcourseId },
      order: [["position", "ASC"], ["createdAt", "ASC"]]
    });
    res.json(mats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const mat = await Material.findByPk(id);
    if (!mat) return res.status(404).json({ message: "Not found" });

    // permission: only coach who owns the course or admin
    const user = req.user;
    const course = await Course.findByPk(mat.subcourseId ? (await Subcourse.findByPk(mat.subcourseId)).courseId : null);
    // simple check — assume req.user has is_admin boolean and profileId. Adjust to your logic:
    if (!user.is_admin && !user.is_coach) {
      // further: coach-only should verify ownership — left for your app-specific logic
      return res.status(403).json({ message: "Forbidden" });
    }

    await mat.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const renameMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category } = req.body;
    const mat = await Material.findByPk(id);
    if (!mat) return res.status(404).json({ message: "Not found" });

    if (name !== undefined) mat.originalName = name;
    if (category !== undefined) mat.category = category;
    await mat.save();
    res.json(mat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const reorderMaterials = async (req, res) => {
  try {
    const subcourseId = req.params.id;
    const { order } = req.body; // order = [materialId1, materialId2, ...]
    if (!Array.isArray(order)) return res.status(400).json({ message: "Invalid order" });

    // Update positions in transaction ideally, but simple loop:
    for (let i = 0; i < order.length; i++) {
      await Material.update({ position: i }, { where: { id: order[i], subcourseId } });
    }
    res.json({ message: "Reordered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comments
export const addComment = async (req, res) => {
  try {
    const materialId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;
    if (!content) return res.status(400).json({ message: "Content required" });
    const comment = await Comment.create({ materialId, userId, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const materialId = req.params.id;
    const comments = await Comment.findAll({ where: { materialId }, order: [["createdAt","ASC"]] });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
