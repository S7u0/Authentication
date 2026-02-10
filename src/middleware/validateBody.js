const HTTP_STATUS = require('../constants/statusCodes');

const validateBody = (schema, property = 'body') => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req[property], {
			abortEarly: false,
			stripUnknown: true,
			allowUnknown: false,
		});

		if (error) {
			const err = new Error(
				error.details.map((d) => d.message.replace(/"/g, '')).join(', ')
			);
			err.statusCode = HTTP_STATUS.BAD_REQUEST;
			return next(err);
		}

		req[property] = value;
		next();
	};
};

module.exports = validateBody;
