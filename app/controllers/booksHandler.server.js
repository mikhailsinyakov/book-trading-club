"use strict";
const Books = require('../models/books');

function BooksHandler() {
    
    this.getAllBooks = (req, res) => {
        Books.find({}, {user_email: false, _id: false}, (err, books) => {
            if (err) return res.status(500).send(err);
            res.json(books);
        });
    };
    
    this.getMyBooks = (req, res) => {
        const user_email = req.user.email;
        Books.find({user_email}, {user_email: false, _id: false}, (err, books) => {
            if (err) return res.status(500).send(err);
            res.json(books);
        });
    };
    
}

module.exports = BooksHandler;