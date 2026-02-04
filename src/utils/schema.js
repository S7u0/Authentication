const Joi = require("joi");


const registerSchema = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	dateOfBirth: Joi.date().less("now").required(),
	password: Joi.string()
		.min(6)
		.required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
});

const changePasswordSchema = Joi.object({
	email: Joi.string().email().required(),
	oldPassword: Joi.string().required(),
	newPassword: Joi.string()
		.min(6)
		.required(),
});

const refreshTokenSchema = Joi.object({
	refreshToken: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
    newPassword : Joi.string().min(6).required()
});

const logoutSchema = Joi.object({
	email: Joi.string().email().required(),
	refreshToken: Joi.string().required(),
});


module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema,
    resetPasswordSchema,
    logoutSchema
};