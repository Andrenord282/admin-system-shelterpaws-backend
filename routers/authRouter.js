const Router = require('express');
const authController = require('../controllers/authController');
const router = new Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.get('/sign-out', authController.signOut);
router.get('/refresh', authController.refresh);

module.exports = router;
