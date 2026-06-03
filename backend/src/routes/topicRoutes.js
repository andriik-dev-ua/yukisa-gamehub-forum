import express from 'express';
import { createTopic, deleteTopic, getTopic, listTopics, toggleTopicLike, updateTopic } from '../controllers/topicController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', listTopics);
router.post('/', protect, createTopic);
router.get('/:id', getTopic);
router.put('/:id', protect, updateTopic);
router.delete('/:id', protect, deleteTopic);
router.post('/:id/like', protect, toggleTopicLike);
export default router;
