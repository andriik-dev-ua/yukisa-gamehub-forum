const router = require('express').Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStats);

module.exports = router;
