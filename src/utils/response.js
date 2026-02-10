const sendResponse = (res, statusCode, message, data, meta) => {
	const success = statusCode >= 200 && statusCode < 300;

	const response = {
		success,
		message,
	};

	if (data !== undefined && data !== null) {
		response.data = data;
	}

	if (meta) {
		response.meta = meta;
	}

	return res.status(statusCode).json(response);
};

module.exports = sendResponse;
