import Course from "../models/Course.js";
import User from "../models/User.js";
import StudentProgress from "../models/studentProgress.js";
import Purchase from "../models/Purchase.js";
import Subcourse from "../models/Subcourse.js";
import Coaches from "../models/coach.js";
import Assignment from "../models/Assignment.js";

export const getStudentsProgress = async (req, res) => {
  const coachProfileId = req.user.profileId;

  try {
    const coach = await Coaches.findOne({ where: { profileId: coachProfileId } });
    if (!coach) return res.status(404).json({ error: "Coach not found" });

    const courses = await Course.findAll({
      where: { coachId: coach.id },
      include: [{ model: Subcourse, attributes: ["id"] }], // for total subcourses
    });

    const results = await Promise.all(
      courses.map(async (course) => {
        const purchases = await Purchase.findAll({
          where: { courseId: course.id },
          include: [{ model: User, attributes: ["id", "name"] }],
        });

        const totalSubcourses = await Subcourse.count({ where: { courseId: course.id } });
        const totalAssignments = await Assignment.count({ where: { courseId: course.id } });
        const totalItems = totalSubcourses + totalAssignments || 1; // avoid div by 0

        const students = await Promise.all(
          purchases.map(async (purchase) => {
            const completed = await StudentProgress.count({
              where: {
                studentId: purchase.userId,
                courseId: course.id,
                isDone: true,
              },
            });

            const percent = Math.round((completed / totalItems) * 100);

            return {
              studentId: purchase.userId,
              name: purchase.User?.name || "Unknown Student",
              course: course.title,
              progress: percent,
            };
          })
        );

        return {
          courseId: course.id,
          title: course.title,
          students,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("getStudentsProgress error:", err);
    res.status(500).json({ error: err.message });
  }
};


