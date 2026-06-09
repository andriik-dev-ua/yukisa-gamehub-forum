const router = require('express').Router();
const postController = require('../controllers/postController');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/thread/:threadId', optionalAuth, postController.getByThread);
router.post('/thread/:threadId', authenticate, postController.create);
router.put('/:id', authenticate, postController.update);
router.delete('/:id', authenticate, postController.remove);

module.exports = router;
