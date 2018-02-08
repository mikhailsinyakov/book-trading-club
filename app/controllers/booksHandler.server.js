"use strict";
const request = require('request');
const convert = require('xml-js');
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
    
    this.addBook = (req, res) => {
        const apiUrl = 'https://www.goodreads.com/search';
        const query = `?q=${req.body.bookName}`;
        const apiKey = `&key=${process.env.GOODREADS_API_KEY}`;
        const url = apiUrl + query + apiKey;
        request(url, (err, response, body) => {
            if (err) return res.status(500).send(err);
            const data = convert.xml2js(body, {compact: true});
            const bookData = data.GoodreadsResponse.search.results.work[0];
            const goodreadsId = +bookData.id._text;
            const user_email = req.body.email;
            Books.find({user_email}, (err, books) => {
                if (err) return res.status(500).send(err);
                const alreadyAdded = !!books.filter(book => book.goodreadsId == goodreadsId).length;
                if (alreadyAdded) return res.status(409).send('This book has already added');
                const title = bookData.best_book.title._text;
                const img_url = bookData.best_book.image_url._text;
                const newBook = new Books({goodreadsId, user_email, title, img_url});
                newBook.save((err, result) => {
                    if (err) return res.status(500).send(err);
                    console.log(result);
                    res.redirect('/myBooks');
                });
            });
            
        });
    };
    
}

module.exports = BooksHandler;