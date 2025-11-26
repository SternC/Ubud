// server/controllers/coachApplicationController.js
import models from "../models/index.js";
const { CoachApplication, Profile, Coach } = models;

export const submitApplication = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });

    const application_data = req.body.application_data || {};
    const app = await CoachApplication.create({ profileId: profile.id, applicationData: application_data });

    await Profile.update({ role: "coach_pending" }, { where: { id: profile.id } });

    res.status(201).json({ message: "Application submitted", application: app });
  } catch (err) {
    console.error("submitApplication err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listApplications = async (req, res) => {
  try {
    const apps = await CoachApplication.findAll({ order: [["submittedAt", "DESC"]] });
    res.json({ applications: apps });
  } catch (err) {
    console.error("listApplications err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await CoachApplication.findByPk(id);
    if (!app) return res.status(404).json({ error: "Application not found" });
    res.json({ application: app });
  } catch (err) {
    console.error("getApplication err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params; // or from body
    const adminNotes = req.body.adminNotes || null;
    const app = await CoachApplication.findByPk(applicationId);
    if (!app) return res.status(404).json({ error: "Application not found" });

    app.status = "approved";
    app.reviewedAt = new Date();
    app.adminNotes = adminNotes;
    await app.save();

    await Profile.update({ role: "coach" }, { where: { id: app.profileId } });

    const [coach, created] = await Coach.findOrCreate({ where: { profileId: app.profileId }, defaults: { teachingField: null, driveLink: null } });

    res.json({ message: "Approved", coach });
  } catch (err) {
    console.error("approveApplication err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
