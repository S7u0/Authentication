const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const { isAuth } = require('../middleware/authenticate');
const validateBody = require('../middleware/validateBody');
const wrapAsync = require('../utils/wrapAsync');
const {
	registerSchema,
	loginSchema,
	forgotPasswordSchema,
	changePasswordSchema,
	refreshTokenSchema,
	resetPasswordSchema,
} = require('../utils/schema');


router.post(
	'/register',
	validateBody(registerSchema),
	wrapAsync(UserController.register)
);

router.post(
	'/login',
	validateBody(loginSchema),
	wrapAsync(UserController.login)
);

router.post('/logout', wrapAsync(UserController.logout));

router.patch(
	'/reset-password/:token',
	validateBody(resetPasswordSchema),
	wrapAsync(UserController.resetPasswordWithToken)
);

router.patch(
	'/change-password',
	validateBody(changePasswordSchema),
	isAuth,
	wrapAsync(UserController.changePassword)
);

router.delete('/delete-user', isAuth, wrapAsync(UserController.deleteUser));

router.post(
	'/refresh-token',
	validateBody(refreshTokenSchema),
	wrapAsync(UserController.refreshToken)
);

router.post(
	'/forgot-password',
	validateBody(forgotPasswordSchema),
	wrapAsync(UserController.forgotPassword)
);

module.exports = router;
