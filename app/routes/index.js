'use strict';

const path = process.cwd();

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
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/signup')
		.get((req, res) => {
			res.sendFile(path + '/public/signup.html');
		});

	app.route('/login')
		.get((req, res) => {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	app.route('/settings')
		.get(isLoggedIn, (req, res) => {
			res.sendFile(path + '/public/settings.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, (req, res) => {
			res.json(req.user);
		});

};
