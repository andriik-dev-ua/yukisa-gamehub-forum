import express from 'express';
import { createComment, deleteComment, toggleCommentLike, updateComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/topic/:topicId', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);
export default router;
