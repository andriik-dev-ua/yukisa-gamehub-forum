const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/ranking', userController.getRanking);
router.get('/:id', userController.getProfile);
router.put('/:id', authenticate, upload.single('avatar'), userController.updateProfile);
router.get('/', authenticate, requireAdmin, userController.getAll);
router.put('/:id/role', authenticate, requireAdmin, userController.updateRole);
router.put('/:id/block', authenticate, requireAdmin, userController.toggleBlock);

module.exports = router;
