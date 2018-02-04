'use strict';

const User = require('../models/users');
const LocalStrategy = require('passport-local');

module.exports = passport => {
	passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	passport.deserializeUser((email, done) => {
		User.findOne({email}, (err, user) => {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({usernameField: 'email'},
									(email, password, done) => {
		process.nextTick(() => {
			User.findOne({email}, (err, user) => {
				if (err) {
					return done(err);
				}
				if (!user || !user.verifyPassword(password)) {
					return done(null, false);
				}
				return done(null, user);
			});
		});
	}));
};
