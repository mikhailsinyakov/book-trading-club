'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
	goodreadsId: Number,
	bookTitle: String,
	owner_email: String,
	offerer_email: String,
	owner_firstName: String,
	offerer_firstName: String,
	state: String
});

module.exports = mongoose.model('Trade', TradeSchema);
