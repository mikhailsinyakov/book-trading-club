"use strict";

function BooksController() {
    
    this.getBooks = () => {
        let apiUrl;
        if (location.pathname == '/allBooks') apiUrl = appUrl + '/api/getAllBooks';
        if (location.pathname == '/myBooks') apiUrl = appUrl + '/api/getMyBooks';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, (status, data) => {
            if (status == 200) {
                const books = JSON.parse(data);
                const booksContainer = document.querySelector(".books");
                books.forEach(val => {
                    const img = document.createElement("img");
                    img.src = val.img_url;
                    img.alt = val.name;
                    img.width = 98;
                    img.height = 147;
                    booksContainer.appendChild(img);
                });
            }
        }));
    };
    
}

const booksController = new BooksController();
booksController.getBooks();