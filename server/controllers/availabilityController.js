// server/controllers/availabilityController.js
import models from "../models/index.js";
const { Availability, Coach } = models;

export const createAvailability = async (req, res) => {
  try {
    const profile = req.profile;
    if (!profile) return res.status(401).json({ error: "Profile required" });
    if (profile.role !== "coach") return res.status(403).json({ error: "Only coaches can create availabilities" });

    const coach = await Coach.findOne({ where: { profileId: profile.id } });
    if (!coach) return res.status(400).json({ error: "Coach not found" });

    const { date, startTime, endTime, maxStudents, price } = req.body;
    if (!date || !startTime || !endTime) return res.status(400).json({ error: "date, startTime and endTime are required" });

    const avail = await Availability.create({
      coachId: coach.id,
      date,
      startTime,
      endTime,
      isAvailable: 1,
      maxStudents: maxStudents || 1,
      price: price || null
    });

    res.status(201).json({ message: "Availability created", availability: avail });
  } catch (err) {
    console.error("createAvailability err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listAvailabilities = async (req, res) => {
  try {
    const { coachId, date } = req.query;
    const where = {};
    if (coachId) where.coachId = coachId;
    if (date) where.date = date;
    const list = await Availability.findAll({ where, order: [["date", "ASC"], ["startTime", "ASC"]] });
    res.json({ availabilities: list });
  } catch (err) {
    console.error("listAvailabilities err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
