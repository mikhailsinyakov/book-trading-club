'use strict';

const Users = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;

module.exports = passport => {
	passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	passport.deserializeUser((email, done) => {
		Users.findOne({email}, (err, user) => {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	},
		(req, email, password, done) => {
			process.nextTick(() => {
				Users.findOne({email}, (err, user) => {
					if (err) return done(err);
					if (user) return done(null, false, req.flash('signupMessage', 'This email has already taken'));
					const newUser = new Users();
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					newUser.firstName = req.body.firstName;
					newUser.save((err, result) => {
						if (err) throw err;
						return done(null, newUser);
					});
				});
				
			});
	}));
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	},
		(req, email, password, done) => {
			process.nextTick(() => {
				Users.findOne({email}, (err, user) => {
					if (err) return done(err);
					if (!user) {
						return done(null, false, req.flash('loginMessage', 'Incorrect email or password'));
					}
					if (!user.validPassword(password, user.password)) {
						return done(null, false, req.flash('loginMessage', 'Incorrect email or password'));
					}
					return done(null, user);
				});
				
			});
	}));
};
