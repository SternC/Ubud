
import models from "../models/index.js";
const { Course, Coach } = models;

export const createCourse = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });
    if (profile.role !== "coach") return res.status(403).json({ error: "Only coaches can create courses" });

    const coach = await Coach.findOne({ where: { profileId: profile.id } });
    if (!coach) return res.status(400).json({ error: "Coach record not found" });

    const { title, description, price, old_price, material_url } = req.body;
    const course = await Course.create({
      coachId: coach.id,
      title,
      description,
      price: price || null,
      oldPrice: old_price || null,
      materialUrl: material_url || null
    });

    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    console.error("createCourse err", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ courses });
  } catch (err) {
    console.error("listCourses err", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ course });
  } catch (err) {
    console.error("getCourse err", err);
    res.status(500).json({ error: "Server error" });
  }
};
