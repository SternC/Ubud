import express from 'express';
import appointmentController from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getUserAppointments);
router.put('/:appointmentId/status', appointmentController.updateAppointmentStatus);

export default router;