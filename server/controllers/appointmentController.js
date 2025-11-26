// server/controllers/appointmentController.js
import models from "../models/index.js";
const { Appointment, Availability, Coach } = models;

export const createAppointment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const { availabilityId, courseId, appointmentDatetime, notes } = req.body;
    if (!availabilityId || !appointmentDatetime) return res.status(400).json({ error: "availabilityId and appointmentDatetime required" });

    const availability = await Availability.findByPk(availabilityId);
    if (!availability || !availability.isAvailable) return res.status(404).json({ error: "Availability not found or not available" });

    const existingCount = await Appointment.count({ where: { availabilityId, status: ["pending", "confirmed"] } });
    if (existingCount >= availability.maxStudents) return res.status(400).json({ error: "Availability full" });

    const coach = await Coach.findByPk(availability.coachId);
    if (!coach) return res.status(404).json({ error: "Coach not found" });

    const appointment = await Appointment.create({
      studentId: user.id,
      coachId: coach.id,
      availabilityId,
      courseId: courseId || null,
      appointmentDatetime,
      status: "pending",
      notes: notes || null
    });

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    console.error("createAppointment err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const listAppointmentsForUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const appointments = await Appointment.findAll({ where: { studentId: user.id }, order: [["appointmentDatetime", "DESC"]] });
    res.json({ appointments });
  } catch (err) {
    console.error("listAppointmentsForUser err:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (status) appointment.status = status;
    if (meetingLink) appointment.meetingLink = meetingLink;
    await appointment.save();

    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    console.error("updateAppointmentStatus err:", err);
    res.status(500).json({ error: "Server error" });
  }
};
