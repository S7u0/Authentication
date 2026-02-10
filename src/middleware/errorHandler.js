const HTTP_STATUS = require('../constants/statusCodes');

const handleError = (err, req, res, next) => {
	let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
	let message = err.message || 'Internal Server Error';

	if (err.code === 11000) {
		statusCode = HTTP_STATUS.BAD_REQUEST;
		message = 'Duplicate field value';
	}

	if (err.name === 'ValidationError') {
		statusCode = HTTP_STATUS.BAD_REQUEST;
		message = Object.values(err.errors)
			.map((e) => e.message)
			.join(', ');
	}

	if (err.name === 'JsonWebTokenError') {
		statusCode = HTTP_STATUS.UNAUTHORIZED;
		message = 'Invalid token';
	}

	if (err.name === 'TokenExpiredError') {
		statusCode = HTTP_STATUS.UNAUTHORIZED;
		message = 'Token expired';
	}

	if (process.env.NODE_ENV !== 'production') {
		console.error('❌ ERROR:', err);
	} else {
		console.error(`❌ ERROR: ${message}`);
	}

	res.status(statusCode).json({
		success: false,
		message,
	});
};

module.exports = handleError;
