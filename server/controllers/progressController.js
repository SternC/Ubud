import StudentProgress from "../models/studentProgress.js";
import Subcourse from "../models/Subcourse.js";
import Assignment from "../models/Assignment.js";
import Purchase from "../models/Purchase.js";
import { Op } from "sequelize";


// Helper: check if student owns the course
const ensureCourseAccess = async (studentId, courseId) => {
  const purchase = await Purchase.findOne({
    where: { userId: studentId, courseId },
  });
  return !!purchase;
};

export const markSubcourseDone = async (req, res) => {
  const studentId = req.user.id;
  const { subcourseId, courseId } = req.body;

  try {
    // 🔒 prevent marking progress for unpurchased courses
    const ownsCourse = await ensureCourseAccess(studentId, courseId);
    if (!ownsCourse)
      return res.status(403).json({ error: "You have not purchased this course." });

    const [progress] = await StudentProgress.findOrCreate({
      where: { studentId, subcourseId, courseId },
      defaults: { isDone: true },
    });

    progress.isDone = true;
    await progress.save();

    res.json({ message: "Subcourse marked as done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAssignmentDone = async (req, res) => {
  const studentId = req.user.id;
  const { assignmentId, courseId } = req.body;

  try {
    // 🔒 prevent marking progress for unpurchased courses
    const ownsCourse = await ensureCourseAccess(studentId, courseId);
    if (!ownsCourse)
      return res.status(403).json({ error: "You have not purchased this course." });

    const [progress] = await StudentProgress.findOrCreate({
      where: { studentId, assignmentId, courseId },
      defaults: { isDone: true },
    });

    progress.isDone = true;
    await progress.save();

    res.json({ message: "Assignment marked as done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseProgress = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const ownsCourse = await ensureCourseAccess(studentId, courseId);
    if (!ownsCourse)
      return res.status(403).json({ error: "You have not purchased this course." });

    const totalSubcourses = await Subcourse.count({ where: { courseId } });
    const totalAssignments = await Assignment.count({ where: { courseId } });

    const totalItems = totalSubcourses + totalAssignments;

    const completed = await StudentProgress.count({
      where: { studentId, courseId, isDone: true },
    });

    const percent =
      totalItems === 0 ? 0 : Math.round((completed / totalItems) * 100);

    res.json({
      totalSubcourses,
      totalAssignments,
      completed,
      percent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignmentProgress = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const ownsCourse = await ensureCourseAccess(studentId, courseId);
    if (!ownsCourse)
      return res.status(403).json({ error: "You have not purchased this course." });

    const completedAssignments = await StudentProgress.findAll({
      where: {
        studentId,
        courseId,
        assignmentId: { [Op.ne]: null },
        isDone: true,
      },
      attributes: ["assignmentId"],
    });

    res.json(completedAssignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubcourseProgress = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const progress = await StudentProgress.findAll({
      where: {
        studentId,
        courseId,
        subcourseId: { [Op.ne]: null },
        isDone: true,
      },
      attributes: ["subcourseId"],
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
