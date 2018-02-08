"use strict";

function BooksController() {
    
    this.getBooks = callback => {
        let apiUrl;
        const isAllBooksPage = location.pathname == '/allBooks';
        const isMyBooksPage = location.pathname == '/myBooks';
        if (isAllBooksPage) apiUrl = '/api/getAllBooks';
        if (isMyBooksPage) apiUrl = '/api/getMyBooks';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, (status, data) => {
            if (status == 200) {
                const books = JSON.parse(data);
                callback(books);
            }
        }));
    };
    
    this.deleteBook = id => {
        const apiUrl = `/api/deleteBook/${id}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    };
    
}

const booksController = new BooksController();
