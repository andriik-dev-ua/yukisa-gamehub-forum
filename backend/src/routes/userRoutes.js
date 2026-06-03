import express from 'express';
import { getProfile, ranking, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/ranking', ranking);
router.get('/:id', getProfile);
router.put('/me/profile', protect, updateProfile);
export default router;
