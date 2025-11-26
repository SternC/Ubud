// server/controllers/coachController.js
import models from "../models/index.js";
const { Coach, Profile } = models;

export const createCoachProfile = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });

    const { teachingField, driveLink } = req.body;

    const [coach, created] = await Coach.findOrCreate({
      where: { profileId: profile.id },
      defaults: { teachingField: teachingField || null, driveLink: driveLink || null }
    });

    if (!created) {
      coach.teachingField = teachingField || coach.teachingField;
      coach.driveLink = driveLink || coach.driveLink;
      await coach.save();
    }

    if (profile.role !== "coach") {
      await Profile.update({ role: "coach" }, { where: { id: profile.id } });
    }

    res.json({ message: "Coach record created/updated", coach });
  } catch (err) {
    console.error("createCoachProfile err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
