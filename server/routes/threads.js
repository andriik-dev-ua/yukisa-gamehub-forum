const router = require('express').Router();
const threadController = require('../controllers/threadController');
const { authenticate, optionalAuth, requireModerator } = require('../middleware/auth');

router.get('/', threadController.getAll);
router.get('/latest', threadController.getLatest);
router.get('/:id', optionalAuth, threadController.getById);
router.post('/', authenticate, threadController.create);
router.put('/:id', authenticate, threadController.update);
router.delete('/:id', authenticate, threadController.remove);
router.put('/:id/pin', authenticate, requireModerator, threadController.togglePin);
router.put('/:id/lock', authenticate, requireModerator, threadController.toggleLock);

module.exports = router;
