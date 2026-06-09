const router = require('express').Router();
const likeController = require('../controllers/likeController');
const { authenticate } = require('../middleware/auth');

router.post('/toggle', authenticate, likeController.toggle);

module.exports = router;
