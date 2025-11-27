import Availability from "../models/availability.js";
import Coaches from "../models/coach.js";
import Profile from "../models/Profile.js";

// Coach menambahkan jadwal availability
export const addAvailability = async (req, res) => {
  const { date, time } = req.body;
  const userId = req.user.id; // Dari verifyToken middleware

  try {
    // 1. Cari Profile user ini
    const profile = await Profile.findOne({ where: { userId } });
    if (!profile || !profile.is_coach) {
      return res.status(403).json({ message: "Access denied. Only coaches can set availability." });
    }

    // 2. Cari ID Coach berdasarkan Profile ID
    const coach = await Coaches.findOne({ where: { profileId: profile.id } });
    if (!coach) return res.status(404).json({ message: "Coach record not found." });

    // 3. Buat Availability
    const newSlot = await Availability.create({
      coachId: coach.id,
      date,
      time,
      status: "available",
    });

    res.status(201).json({ message: "Availability added", data: newSlot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Student (atau Public) melihat jadwal coach tertentu
export const getCoachAvailability = async (req, res) => {
  const { coachId } = req.params;

  try {
    const slots = await Availability.findAll({
      where: {
        coachId,
        status: "available", // Hanya tampilkan yang belum di-book
      },
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};