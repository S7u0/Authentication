const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
	},
	dateOfBirth: {
		type: Date,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
	},
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
});


userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;
	this.password = await bcrypt.hash(this.password, 15);
});

module.exports = mongoose.model('User', userSchema);
