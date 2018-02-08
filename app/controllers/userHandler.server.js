"use script";
const Users = require('../models/users');
const BooksHandler = require('./booksHandler.server');

const booksHandler = new BooksHandler();

function UserHandler() {
    
    this.changeSettings = (req, res) => {
        Users.findOne({email: req.body.email}, (err, user) => {
            if (err) return res.status(500).send(err);
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.city = req.body.city;
            user.country = req.body.country;
            user.save((err, result) => {
                if (err) return res.status(500).send(err);
                return res.redirect('/settings');
            });
        });
    };
    
    this.changePassword = (req, res) => {
        Users.findOne({email: req.body.email}, (err, user) => {
            if (err) return res.status(500).send(err);
            if (user.validPassword(req.body.password, user.password)) {
                user.password = user.generateHash(req.body.newPassword);
            }
            else return res.sendStatus(403);
            user.save((err, result) => {
                if (err) return res.status(500).send(err);
                return res.redirect('/settings');
            });
        });
    };
    
    this.deleteAccount = (req, res) => {
        Users.findOne({email: req.user.email}, (err, user) => {
            if (err) return res.status(500).send(err);
            user.remove();
            booksHandler.deleteAllBooksOfUser(req, res);
        });
    };
}

module.exports = UserHandler;