const sendResponse = require('../utils/response');
const HTTP_STATUS = require('../constants/statusCodes');

const {
	registerUser,
	loginUser,
	refreshTokenService,
	logoutUser,
	changePasswordService,
	resetPasswordService,
	forgetPasswordService,
	deleteUserService,
} = require('../services/userServices');

const register = async (req, res) => {
	await registerUser(req.body);
	return sendResponse(res, HTTP_STATUS.CREATED, 'User registered successfully');
};

const login = async (req, res) => {
	const tokens = await loginUser(req.body);
	return sendResponse(res, HTTP_STATUS.OK, 'Login successful', tokens);
};

const refreshToken = async (req, res) => {
	const accessToken = await refreshTokenService(req.body.refreshToken);
	return sendResponse(res, HTTP_STATUS.OK, 'Token refreshed', {
		accessToken,
	});
};

const logout = async (req, res) => {
	await logoutUser(req.body.refreshToken);
	return sendResponse(res, HTTP_STATUS.OK, 'Logout successful');
};

const resetPasswordWithToken = async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;
	await resetPasswordService(token, newPassword);
	return sendResponse(res, HTTP_STATUS.OK, 'Password reset successful');
};

const changePassword = async (req, res) => {
	await changePasswordService(
		req.user.id,
		req.body.oldPassword,
		req.body.newPassword
	);
	return sendResponse(res, HTTP_STATUS.OK, 'Password changed successfully');
};

const deleteUser = async (req, res) => {
	await deleteUserService(req.user.id);
	return sendResponse(res, HTTP_STATUS.OK, 'User account deleted successfully');
};

const forgotPassword = async (req, res) => {
	const resetToken = await forgetPasswordService(req.body.email);
	const resetLink = `${req.protocol}:${req.patch('host')}/reset-password/${resetToken}`;
	return sendResponse(res, HTTP_STATUS.OK, 'Password reset link generated', {
		resetLink,
	});
};

module.exports = {
	register,
	login,
	refreshToken,
	logout,
	resetPasswordWithToken,
	changePassword,
	deleteUser,
	forgotPassword,
};
