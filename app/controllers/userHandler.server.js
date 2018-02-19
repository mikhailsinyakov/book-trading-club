"use script";
const Users = require('../models/users');

function UserHandler() {
    
    this.getUserFirstNameByEmail = email => {
        return new Promise((resolve, reject) => {
            Users.findOne({email})
                    .then(user => resolve(user.firstName))
                    .catch(err => reject(err));
        });
        
    };
    
    this.changeSettings = (req, res) => {
        Users.findOne({email: req.body.email})
                .then(user => {
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.city = req.body.city;
                    user.country = req.body.country;
                    user.save((err, result) => {
                        if (err) return res.status(500).send(err);
                        return res.redirect('/settings');
                    });
                })
                .catch(err => res.status(500).send(err));
    };
    
    this.changePassword = (req, res) => {
        Users.findOne({email: req.body.email})
                .then(user => {
                    if (user.validPassword(req.body.password, user.password)) {
                        user.password = user.generateHash(req.body.newPassword);
                    }
                    else return res.sendStatus(403);
                    user.save((err, result) => {
                        if (err) return res.status(500).send(err);
                        return res.redirect('/settings');
                    });
                })
                .catch(err => res.status(500).send(err));
    };
    
    this.deleteAccount = (req, res) => {
        
        const BooksHandler = require('./booksHandler.server');
        const TradesHandler = require('./tradesHandler.server');
        const booksHandler = new BooksHandler();
        const tradesHandler = new TradesHandler();
        const user_email = req.user.email;
        Users.findOne({email: user_email})
                .then(user => user.remove())
                .then(() => booksHandler.deleteAllBooksOfUser(user_email))
                .then(() => tradesHandler.deleteAllProposalsOfUser(user_email))
                .then(status => res.sendStatus(200))
                .catch(err => res.status(500).send(err));
    };
}

module.exports = UserHandler;