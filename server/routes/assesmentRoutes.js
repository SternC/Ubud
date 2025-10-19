// routes/assessment.js
import express from "express";
import Assessment from "../models/Assessment.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// GET semua assessment (untuk dashboard)
router.get("/", async (req, res) => {
  const isCoach = req.user.is_coach;
  const userId = req.user.id;
  try {
    const assessments = isCoach
      ? await Assessment.findAll({ where: { coachId: userId } })
      : await Assessment.findAll();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// CREATE assessment (coach)
router.post("/", async (req, res) => {
  if (!req.user.is_coach) return res.status(403).json({ msg: "Forbidden" });
  try {
    const assessment = await Assessment.create({ ...req.body, coachId: req.user.id });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// EDIT assessment (coach)
router.put("/:id", async (req, res) => {
  if (!req.user.is_coach) return res.status(403).json({ msg: "Forbidden" });
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ msg: "Not found" });
    await assessment.update(req.body);
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ADD submission (student)
router.post("/:id/submission", async (req, res) => {
  if (req.user.is_coach) return res.status(403).json({ msg: "Coach cannot submit" });
  try {
    const assessment = await Assessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ msg: "Assessment not found" });

    const submission = await Submission.create({
      assessmentId: assessment.id,
      studentId: req.user.id,
      submittedAt: new Date(),
    });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET submissions untuk assessment tertentu (opsional, untuk dashboard coach)
router.get("/:id/submissions", async (req, res) => {
  try {
    const subs = await Submission.findAll({ where: { assessmentId: req.params.id } });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
