import Assessment from "../models/Assessment.js";

// GET all
export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.findAll({ order: [["dueDate", "DESC"]] });
    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createAssessment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const assessment = await Assessment.create({ title, description, dueDate });
    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const assessment = await Assessment.findByPk(id);
    if (!assessment) return res.status(404).json({ message: "Not found" });

    await assessment.update({ title, description, dueDate });
    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findByPk(id);
    if (!assessment) return res.status(404).json({ message: "Not found" });

    await assessment.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
