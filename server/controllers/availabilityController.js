import { Availability, User, Course } from '../models/index.js';

const availabilityController = {
  createAvailability: async (req, res) => {
    try {
      const coachId = req.user.id;
      const { date, startTime, endTime, maxStudents, price } = req.body;

      // Cek apakah user adalah coach
      if (req.user.role !== 'coach') {
        return res.status(403).json({
          success: false,
          message: 'Only coaches can create availability'
        });
      }

      const availability = await Availability.create({
        coachId,
        date,
        startTime,
        endTime,
        maxStudents,
        price
      });

      res.status(201).json({
        success: true,
        data: availability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getCoachAvailability: async (req, res) => {
    try {
      const coachId = req.params.coachId || req.user.id;

      const availability = await Availability.findAll({
        where: { coachId },
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      });

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateAvailability: async (req, res) => {
    try {
      const { availabilityId } = req.params;
      const coachId = req.user.id;

      const availability = await Availability.findOne({
        where: { id: availabilityId, coachId }
      });

      if (!availability) {
        return res.status(404).json({
          success: false,
          message: 'Availability not found'
        });
      }

      await availability.update(req.body);

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteAvailability: async (req, res) => {
    try {
      const { availabilityId } = req.params;
      const coachId = req.user.id;

      const availability = await Availability.findOne({
        where: { id: availabilityId, coachId }
      });

      if (!availability) {
        return res.status(404).json({
          success: false,
          message: 'Availability not found'
        });
      }

      await availability.destroy();

      res.json({
        success: true,
        message: 'Availability deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default availabilityController;