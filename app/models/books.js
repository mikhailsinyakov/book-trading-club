'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    goodreadsId: Number,
	user_email: String,
	title: String,
	img_url: String
});

module.exports = mongoose.model('Book', BookSchema);