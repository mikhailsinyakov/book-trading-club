'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
	user_email: String,
	name: String,
	img_url: String
});

module.exports = mongoose.model('Book', BookSchema);