const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const HTTP_STATUS = require('../constants/statusCodes');

const registerUser = async (data) => {
	const { username, email, dateOfBirth, password } = data;

	return User.create({
		username,
		email,
		password,
		dateOfBirth: new Date(dateOfBirth),
	});
};

const loginUser = async ({ email, password }) => {
	const user = await User.findOne({ email });
	if (!user) {
		const err = new Error('Invalid credentials');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		const err = new Error('Invalid credentials');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	const accessToken = jwt.sign(
		{ id: user._id },
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: '15m' }
	);

	const refreshToken = crypto.randomBytes(32).toString('hex');
	const hashedToken = crypto
		.createHash('sha256')
		.update(refreshToken)
		.digest('hex');
	user.refreshToken = hashedToken;
	user.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
	await user.save();                                          

	return { accessToken, refreshToken };
};

const refreshTokenService = async (refreshToken) => {
	if (!refreshToken) {
		const err = new Error('Refresh token required');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	let payload;
	try {
		payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
	} catch {
		const err = new Error('Invalid or expired refresh token');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	const user = await User.findOne({
		_id: payload.id,
		refreshToken,
	});

	if (!user) {
		const err = new Error('Refresh token not recognized');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: '15m',
	});
};

const logoutUser = async (email, refreshToken) => {
	await User.findOneAndUpdate(
		{ email, refreshToken },
		{ refreshToken: null }
	);
};

const changePasswordService = async (email, oldPassword, newPassword) => {
	const user = await User.findOne({ email });
	if (!user) {
		const err = new Error('User not found');
		err.statusCode = HTTP_STATUS.NOT_FOUND;
		throw err;
	}

	const isMatch = await bcrypt.compare(oldPassword, user.password);
	if (!isMatch) {
		const err = new Error('Old password is incorrect');
		err.statusCode = HTTP_STATUS.UNAUTHORIZED;
		throw err;
	}

	user.password = newPassword; // hashed via pre-save hook
	await user.save();
};

const forgetPasswordService = async (email) => {
	const user = await User.findOne({ email });
	if (!user) {
		const err = new Error('User not found');
		err.statusCode = HTTP_STATUS.NOT_FOUND;
		throw err;
	}

	const resetToken = crypto.randomBytes(32).toString('hex');
	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	user.resetPasswordToken = hashedToken;
	user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
	await user.save();

	return resetToken;
};

const resetPasswordService = async (token, newPassword) => {
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const user = await User.findOne({	
		resetPasswordToken: hashedToken,
		resetPasswordExpires: { $gt: Date.now() },
	});

	if (!user) {
		const err = new Error('Invalid or expired token');
		err.statusCode = HTTP_STATUS.BAD_REQUEST;
		throw err;
	}

	user.password = newPassword;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();
};

const deleteUserService = async (userId) => {
	await User.findByIdAndDelete(userId);
};

module.exports = {
	registerUser,
	loginUser,
	refreshTokenService,
	logoutUser,
	changePasswordService,
	resetPasswordService,
	forgetPasswordService,
	deleteUserService,
};
