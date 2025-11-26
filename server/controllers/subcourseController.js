// server/controllers/subcourseController.js
import models from "../models/index.js";
const { Subcourse, Course, Coach } = models;

export const createSubcourse = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });
    if (profile.role !== "coach") return res.status(403).json({ error: "Only coaches can create subcourses" });

    const coach = await Coach.findOne({ where: { profileId: profile.id } });
    if (!coach) return res.status(400).json({ error: "Coach not found" });

    const { courseId, title, description, position } = req.body;
    const course = await Course.findOne({ where: { id: courseId, coachId: coach.id } });
    if (!course) return res.status(404).json({ error: "Course not found or not owned by coach" });

    const sub = await Subcourse.create({ courseId, title, description, position: position || 0 });
    res.status(201).json({ message: "Subcourse created", subcourse: sub });
  } catch (err) {
    console.error("createSubcourse err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listSubcourses = async (req, res) => {
  try {
    const { courseId } = req.query;
    const where = {};
    if (courseId) where.courseId = courseId;
    const subs = await Subcourse.findAll({ where, order: [["position", "ASC"]] });
    res.json({ subcourses: subs });
  } catch (err) {
    console.error("listSubcourses err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
