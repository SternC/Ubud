import express from 'express';
import availabilityController from '../controllers/availabilityController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Routes
router.post('/', availabilityController.createAvailability);
router.get('/coach/:coachId', availabilityController.getCoachAvailability);
router.put('/:availabilityId', availabilityController.updateAvailability);
router.delete('/:availabilityId', availabilityController.deleteAvailability);

export default router;