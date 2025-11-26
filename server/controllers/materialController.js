// server/controllers/materialController.js
import models from "../models/index.js";
const { Material, Subcourse, Course, Coach } = models;

export const createMaterial = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });
    if (profile.role !== "coach") return res.status(403).json({ error: "Only coaches can add materials" });

    const { subcourseId, type, fileUrl, youtubeUrl, originalName, category, position } = req.body;
    if (!subcourseId || !type) return res.status(400).json({ error: "subcourseId and type required" });

    const sub = await Subcourse.findByPk(subcourseId);
    if (!sub) return res.status(404).json({ error: "Subcourse not found" });

    const coach = await Coach.findOne({ where: { profileId: profile.id } });
    const course = await Course.findByPk(sub.courseId);
    if (!coach || !course || course.coachId !== coach.id) return res.status(403).json({ error: "Not allowed to add material to this subcourse" });

    const material = await Material.create({
      subcourseId,
      type,
      fileUrl: fileUrl || null,
      youtubeUrl: youtubeUrl || null,
      originalName: originalName || null,
      category: category || null,
      position: position || 0
    });

    res.status(201).json({ message: "Material created", material });
  } catch (err) {
    console.error("createMaterial err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listMaterials = async (req, res) => {
  try {
    const { subcourseId } = req.query;
    const where = {};
    if (subcourseId) where.subcourseId = subcourseId;
    const materials = await Material.findAll({ where, order: [["position", "ASC"]] });
    res.json({ materials });
  } catch (err) {
    console.error("listMaterials err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
