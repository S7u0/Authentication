const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/response');
const HTTP_STATUS = require('../constants/statusCodes');

const isAuth = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return sendResponse(
				res,
				HTTP_STATUS.UNAUTHORIZED,
				'Authentication required'
			);
		}

		const token = authHeader.split(' ')[1];

		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		if (!decoded?.id) {
			return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
		}

		req.user = {
			id: decoded.id,
		};

		next();
	} catch (err) {
		return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Authentication failed');
	}
};

module.exports = { isAuth };
