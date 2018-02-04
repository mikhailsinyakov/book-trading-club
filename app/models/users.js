'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	email: String,
	passwordHash: String,
	firstName: String,
    lastName: String,
    city: String,
    country: String
});

module.exports = mongoose.model('User', User);
