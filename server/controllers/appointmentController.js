import Appointment from "../models/appointment.js";
import Availability from "../models/availability.js";
import Coaches from "../models/coach.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Student melakukan booking
export const bookAppointment = async (req, res) => {
  const { availabilityId } = req.body;
  const userId = req.user.id; // Student ID (User ID)

  try {
    // 1. Cek apakah slot availability valid dan masih available
    const slot = await Availability.findByPk(availabilityId);
    
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.status === "booked") return res.status(400).json({ message: "Slot already booked" });

    // 2. Buat Appointment
    const appointment = await Appointment.create({
      studentId: userId,
      coachId: slot.coachId,
      availabilityId: slot.id,
      status: "confirmed"
    });

    // 3. Update status Availability menjadi 'booked' agar tidak bisa diambil orang lain
    await slot.update({ status: "booked" });

    res.status(201).json({ message: "Appointment booked successfully", data: appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Appointments untuk User (Melihat history booking saya)
export const getMyAppointments = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const appointments = await Appointment.findAll({
      where: { studentId: userId },
      include: [
        { 
          model: Coaches, 
          as: "coach",
          include: [{ model: Profile, attributes: ['name'] }] // Supaya tau nama coachnya
        },
        { model: Availability } // Supaya tau jam dan tanggalnya
      ]
    });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};