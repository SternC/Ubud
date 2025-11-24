import { Appointment, Availability, User, Course, Purchase } from '../models/index.js';

const appointmentController = {
  createAppointment: async (req, res) => {
    try {
      const studentId = req.user.id;
      const { availabilityId, courseId, notes } = req.body;

      // Cek apakah user adalah student
      if (req.user.role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Only students can create appointments'
        });
      }

      // Cek availability
      const availability = await Availability.findByPk(availabilityId);
      if (!availability) {
        return res.status(404).json({
          success: false,
          message: 'Availability not found'
        });
      }

      // Cek apakah student sudah membeli course dari coach ini
      const purchase = await Purchase.findOne({
        where: {
          studentId,
          courseId,
          status: 'completed'
        },
        include: [{
          model: Course,
          where: { coachId: availability.coachId }
        }]
      });

      if (!purchase) {
        return res.status(403).json({
          success: false,
          message: 'You need to purchase a course from this coach first'
        });
      }

      // Cek apakah slot masih tersedia
      const existingAppointments = await Appointment.count({
        where: { availabilityId }
      });

      if (existingAppointments >= availability.maxStudents) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is fully booked'
        });
      }

      // Buat appointment
      const appointment = await Appointment.create({
        studentId,
        coachId: availability.coachId,
        availabilityId,
        courseId,
        appointmentDate: new Date(`${availability.date} ${availability.startTime}`),
        notes
      });

      res.status(201).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getUserAppointments: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let appointments;
      if (userRole === 'student') {
        appointments = await Appointment.findAll({
          where: { studentId: userId },
          include: [
            { model: User, as: 'Coach', attributes: ['id', 'name', 'email'] },
            { model: Course, attributes: ['id', 'title'] },
            { model: Availability, attributes: ['id', 'date', 'startTime', 'endTime'] }
          ],
          order: [['appointmentDate', 'ASC']]
        });
      } else if (userRole === 'coach') {
        appointments = await Appointment.findAll({
          where: { coachId: userId },
          include: [
            { model: User, as: 'Student', attributes: ['id', 'name', 'email'] },
            { model: Course, attributes: ['id', 'title'] },
            { model: Availability, attributes: ['id', 'date', 'startTime', 'endTime'] }
          ],
          order: [['appointmentDate', 'ASC']]
        });
      }

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateAppointmentStatus: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { status, meetingLink } = req.body;
      const userId = req.user.id;

      const appointment = await Appointment.findByPk(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      // Cek authorization (coach atau student yang terkait)
      if (appointment.coachId !== userId && appointment.studentId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment'
        });
      }

      await appointment.update({
        status,
        ...(meetingLink && { meetingLink })
      });

      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default appointmentController;