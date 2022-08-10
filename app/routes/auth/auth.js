let express = require('express');
let httpStatus = require('http-status');

// middlewares
let apiNotFound = loadMiddleware('/api-not-found');
let router = express.Router();
let jwtMiddleware = loadMiddleware('/jwt');
let userMiddleware = loadMiddleware('/user');

// controllers
let authController = loadController('auth/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
// router.post('/create-password', authController.createPassword);
// router.post('/change-password', [jwtMiddleware.checkToken, userMiddleware.isActiveUser], authController.changePassword);

router.get('/my-profile', [jwtMiddleware.checkToken, userMiddleware.isActiveUser], authController.myProfile);
router.post('/update-profile', [jwtMiddleware.checkToken, userMiddleware.isActiveUser], authController.updateProfile);

router.use( apiNotFound );

module.exports = router;
