'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: String,
	password: String,
	firstName: String,
    lastName: String,
    city: String,
    country: String,
    usersTradeRequests: [{
        goodreadsId: Number,
        owner_email: String,
        state: String
    }],
    tradeRequestsForUser: [{
        goodreadsId: Number,
        offerer_email: String,
        state: String
    }]
});

UserSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, 10);
};

UserSchema.methods.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model('User', UserSchema);
