'use strict';

const path = process.cwd();
const UserHandler = require('../controllers/userHandler.server');

const userHandler = new UserHandler();

module.exports = (app, passport) => {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get((req, res) => {
			res.render('pages/index', {user: req.user});
		});
		
	app.route('/signup')
		.get((req, res) => {
			req.logout();
			res.render('pages/signup', {message: req.flash('signupMessage')});
		})
		.post(passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/signup',
			failureFlash: true
		}));

	app.route('/login')
		.get((req, res) => {
			req.logout();
			res.render('pages/login', {message: req.flash('loginMessage')});
		})
		.post(passport.authenticate('local-login', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	app.route('/settings')
		.get(isLoggedIn, (req, res) => {
			res.render('pages/settings', {user: req.user});
		})
		.post(userHandler.changeSettings);
		
	app.route('/changePassword')
		.post(userHandler.changePassword);
		
	app.route('/deleteAccount')
		.delete(userHandler.deleteAccount);

	app.route('/api/:id')
		.get((req, res) => {
			req.user ? res.json(req.user) : res.sendStatus(401);
		});

};
