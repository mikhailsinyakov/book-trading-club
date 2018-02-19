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
    
    this.fillTrades = trades => {
        const yoursSpan = document.querySelector("span.yours");
        const forYouSpan = document.querySelector("span.forYou");
        yoursSpan.innerHTML = trades.usersTradeRequests.length;
        forYouSpan.innerHTML = trades.tradeRequestsForUser.length;
        if (trades.usersTradeRequests.length) {
            const tradesBlock = document.createElement("div");
            const form = document.querySelector("form");
            tradesBlock.id = "yours";
            tradesBlock.classList.add("tradeRequests");
            tradesBlock.style.display = "none";
            trades.usersTradeRequests.forEach(trade => {
                const p = document.createElement("p");
                p.innerHTML = `${trade.owner_firstName} - ${trade.bookTitle} - ${trade.state}`;
                tradesBlock.appendChild(p);
            });
            
            document.body.insertBefore(tradesBlock, form);
        }
        if (trades.tradeRequestsForUser.length) {
            const tradesBlock = document.createElement("div");
            const form = document.querySelector("form");
            tradesBlock.id = "forYou";
            tradesBlock.classList.add("tradeRequests");
            tradesBlock.style.display = "none";
            trades.tradeRequestsForUser.forEach(trade => {
                const p = document.createElement("p");
                p.innerHTML = `${trade.offerer_firstName} - ${trade.bookTitle} - ${trade.state}`;
                tradesBlock.appendChild(p);
            });
            
            document.body.insertBefore(tradesBlock, form);
        }
    };
    
    this.toggleRequests = () => {
        const buttons = Array.from(document.querySelectorAll(".toggleRequests"));
        if (!buttons.length) return;
        
        buttons.forEach(button => {
            button.onclick = e => {
                const whichBtn = e.target.classList.contains("yours") ? "yours"
                                                                      : "forYou";
                let shownBlock = whichBlockShown();
                if (!shownBlock) {
                    showBlock(whichBtn);
                    return;
                }
                if (shownBlock == whichBtn) {
                    hideBlock(whichBtn);
                    return;
                } else {
                    hideBlock(shownBlock);
                    showBlock(whichBtn);
                    return;
                }
                
            };
        });
        
        function whichBlockShown() {
            const tradeRequestsBlocks = Array.from(document.querySelectorAll(".tradeRequests"));
            let shown = null;
            tradeRequestsBlocks.forEach(block => {
                if (block.style.display == "block") shown = block.id;
            });
            return shown;
        }
        
        function showBlock(name) {
            document.querySelector(`#${name}`).style.display = "block";
        }
        
        function hideBlock(name) {
            document.querySelector(`#${name}`).style.display = "none";
        }
        
    };
}

const domController = new DOMController();