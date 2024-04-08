const Router = require('express');
const authController = require('../controllers/authController');
const router = new Router();

router.post('/log-up', authController.logUp);
router.post('/log-in', authController.logIn);
router.get('/log-out', authController.logOut);
router.get('/refresh', authController.refresh);

module.exports = router;
