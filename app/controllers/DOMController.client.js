"use strict";

function DOMController() {
    this.addImages = books => {
        const booksContainer = document.querySelector(".books");
        const isMyBooksPage = location.pathname == '/myBooks';
        const isAllBooksPage = location.pathname == '/allBooks';
        books.forEach(book => {
            const img = document.createElement("img");
            img.src = book.img_url;
            img.alt = book.name;
            img.width = 98;
            img.height = 147;
            booksContainer.appendChild(img);
            const i = document.createElement("i");
            i.classList.add("fa");
            if (isMyBooksPage) {
                i.classList.add("fa-times");
                i.onclick = () => booksController.deleteBook(book.goodreadsId);
            }
            if (isAllBooksPage) {
                i.classList.add("fa-exchange-alt");
                i.onclick = () => tradesController.proposeTrade(book.goodreadsId, book.user_email);
            }
            booksContainer.appendChild(i);
        });
    };
}

const domController = new DOMController();