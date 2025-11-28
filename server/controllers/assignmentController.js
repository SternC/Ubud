import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";

export const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, pdfUrl } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const assignment = await Assignment.create({
      courseId,
      title,
      description,
      pdfUrl,
    });

    res.json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating assignment" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, pdfUrl } = req.body;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    await assignment.update({ title, description, pdfUrl });

    res.json({ message: "Assignment updated", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating assignment" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    await assignment.destroy();
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting assignment" });
  }
};

// Student view
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByPk(id);

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignment" });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerUrl } = req.body;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.studentAnswerUrl = answerUrl;
    await assignment.save();

    res.json({ message: "Answer submitted", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting answer" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewUrl } = req.body;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.coachReviewUrl = reviewUrl;
    await assignment.save();

    res.json({ message: "Review submitted", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting review" });
  }
};

export const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.findAll({
      where: { courseId },
      order: [["createdAt", "DESC"]],
    });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};
