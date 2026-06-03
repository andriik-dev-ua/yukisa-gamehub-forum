import express from 'express';
import { listUsers, setRole, stats, toggleBlockUser } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/stats', stats);
router.get('/users', listUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.patch('/users/:id/role', setRole);
export default router;
