"use strict";

function DOMController() {
    this.addImages = books => {
        const booksContainer = document.querySelector(".books");
        const isMyBooksPage = location.pathname == '/myBooks';
        books.forEach(book => {
            const img = document.createElement("img");
            img.src = book.img_url;
            img.alt = book.name;
            img.width = 98;
            img.height = 147;
            booksContainer.appendChild(img);
            if (isMyBooksPage) {
                const i = document.createElement("i");
                i.classList.add("fa");
                i.classList.add("fa-times");
                i.onclick = () => booksController.deleteBook(book.goodreadsId);
                booksContainer.appendChild(i);
            }
        });
    };
}

const domController = new DOMController();