import Coaches from "../models/coach.js";

export const coachLogin = async (req, res) => {
  const { username, password, driveLink, teachingField } = req.body;

  try {
    const existing = await Coaches.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "You have already applied. Please wait for admin approval." });
    }

    await Coaches.create({
      username,
      password, 
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
