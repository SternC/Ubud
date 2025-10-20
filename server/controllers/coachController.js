import Coaches from "../models/coach.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const coachApply = async (req, res) => {
  const { driveLink, teachingField } = req.body;

  try {
    // req.user.id comes from verifyToken middleware
    const userId = req.user.id;

    // Find the user's profile
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Check if user already applied
    const existing = await Coaches.findOne({ where: { profileId: profile.id } });
    if (existing) {
      return res.status(400).json({ message: "You have already applied. Wait for admin approval." });
    }

    // Create new coach application
    await Coaches.create({
      profileId: profile.id,
      driveLink,
      teachingField,
      status: "pending",
    });

    return res.status(201).json({ message: "Application submitted! Wait for admin approval." });
  } catch (err) {
    console.error("Error creating coach application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coaches.findAll({
      include: [
        {
          model: Profile,
          attributes: ["id", "name", "email"],
          include: [
            {
              model: User,
              attributes: ["id", "email", "name"]
            }
          ]
        }
      ],
      order: [["status", "ASC"]], // pending first
    });
    res.json(coaches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveCoach = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the coach record
    const coach = await Coaches.findByPk(id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    // Update coach status
    await coach.update({ status: "approved" });

    // Update linked profile to set is_coach = 1
    await Profile.update(
      { is_coach: true },
      { where: { id: coach.profileId } }
    );

    res.json({ message: "Coach approved and profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectCoach = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the coach record
    const coach = await Coaches.findByPk(id);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    // Update coach status
    await coach.update({ status: "rejected" });

    // Reset linked profile's is_coach
    await Profile.update(
      { is_coach: false },
      { where: { id: coach.profileId } }
    );

    res.json({ message: "Coach rejected and profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoaches = async (req, res) => {
  try {
    const coaches = await Profile.findAll({
      where: { is_coach: true },
      order: [["userId", "ASC"]],
    });
    res.json(coaches);
  } catch (err) {
    console.error("Get coaches error:", err);
    res.status(500).json({ error: "Failed to fetch coaches" });
  }
};
