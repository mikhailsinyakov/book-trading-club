'use strict';

const path = process.cwd();
const UserHandler = require('../controllers/userHandler.server');
const BooksHandler = require('../controllers/booksHandler.server');

const userHandler = new UserHandler();
const booksHandler = new BooksHandler();

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
		
	app.route('/allBooks')
		.get(isLoggedIn, (req, res) => {
			res.render('pages/allBooks', {user: req.user});
		});
		
	app.route('/myBooks')
		.get(isLoggedIn, (req, res) => {
			res.render('pages/myBooks', {user: req.user});
	});
	
		
	app.route('/api/changePassword')
		.post(userHandler.changePassword);
		
	app.route('/api/deleteAccount')
		.delete(userHandler.deleteAccount);
		
	app.route('/api/getAllBooks')
		.get(isLoggedIn, booksHandler.getAllBooks);
		
	app.route('/api/getMyBooks')
		.get(isLoggedIn, booksHandler.getMyBooks);
		
	app.route('/api/addBook')
		.post(isLoggedIn, booksHandler.addBook);
	
	app.route('/api/deleteBook/:id')
		.delete(isLoggedIn, booksHandler.deleteBook);

	/*app.route('/api/:id')
		.get((req, res) => {
			req.user ? res.json(req.user) : res.sendStatus(401);
		});*/

};
