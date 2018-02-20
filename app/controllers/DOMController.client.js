"use strict";

function DOMController() {
    this.addImages = books => {
        const booksContainer = document.querySelector(".books");
        const isMyBooksPage = location.pathname == '/myBooks';
        const isAllBooksPage = location.pathname == '/allBooks';
        books.forEach(book => {
            const img = document.createElement("img");
            img.src = book.img_url;
            img.alt = book.title;
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
        if (trades.usersTradeRequests.length) addTable(true);
        if (trades.tradeRequestsForUser.length) addTable(false);
        
        function addTable (isUsersRequest) {
            const form = document.querySelector("form");
            const table = createTable(isUsersRequest);
            const tableHead = createTableHead(isUsersRequest);
            table.appendChild(tableHead);
            if (isUsersRequest) {
                trades.usersTradeRequests.forEach(trade => {
                    const tableRow = createTableRow(isUsersRequest, trade);
                    table.appendChild(tableRow);
                });
            }
            else {
                trades.tradeRequestsForUser.forEach(trade => {
                    const tableRow = createTableRow(isUsersRequest, trade);
                    table.appendChild(tableRow);
                });
            }
            document.querySelector("main").insertBefore(table, form);
        }
        
        function createTable(isUsersRequest) {
            const table = document.createElement("table");
            table.id = isUsersRequest ? "yours" : "forYou";
            table.classList.add("tradeRequests");
            table.classList.add("table");
            table.style.display = "none";
            return table;
        }
        
        function createTableHead (isUsersRequest) {
            const tableHead = document.createElement("thead");
            const tableRow = document.createElement("tr");
            const tableHeader1 = document.createElement("th");
            const tableHeader2 = document.createElement("th");
            const tableHeader3 = document.createElement("th");
            
            tableHeader1.innerHTML = isUsersRequest ? "Owner" : "Offerer";
            tableHeader2.innerHTML = "Title";
            tableHeader3.innerHTML = "Answer";
            
            tableHeader1.classList.add("text-center");
            tableHeader2.classList.add("text-center");
            tableHeader3.classList.add("text-center");
            
            tableRow.appendChild(tableHeader1);
            tableRow.appendChild(tableHeader2);
            tableRow.appendChild(tableHeader3);
            tableHead.appendChild(tableRow);
            tableHead.classList.add("thead-light");
            return tableHead;
        }
        
        function createTableRow (isUsersRequest, trade) {
            const tableRow = document.createElement("tr");
            const tableData1 = document.createElement("td");
            const tableData2 = document.createElement("td");
            const tableData3 = document.createElement("td");
            
            tableData1.innerHTML = isUsersRequest ? trade.owner_firstName
                                                   : trade.offerer_firstName;
            tableData2.innerHTML = trade.bookTitle;
            if (!isUsersRequest && trade.state == "sended") {
                const icon1 = createIcon(isUsersRequest, "approved");
                const icon2 = createIcon(isUsersRequest, "unapproved");
                icon1.style.cursor = "pointer";
                icon2.style.cursor = "pointer";
                icon1.onclick = () => tradesController.approveTrade(trade.goodreadsId);
                icon2.onclick = () => tradesController.denyTrade(trade.goodreadsId);
                tableData3.appendChild(icon1);
                tableData3.appendChild(icon2);
            }
            else {
                const icon = createIcon(isUsersRequest, trade.state);
                tableData3.appendChild(icon);
            }
            
            tableData3.classList.add("text-center");
            
            tableRow.appendChild(tableData1);
            tableRow.appendChild(tableData2);
            tableRow.appendChild(tableData3);
            return tableRow;
        }
        
        function createIcon (isUsersRequest, state) {
            const icon = document.createElement("i");
            icon.classList.add("fas");
            let iconName;
            if (state == "sended") iconName = "fa-spinner";
            else if (state == "approved") iconName = "fa-check";
            else iconName = "fa-times";
            icon.classList.add(iconName);
            return icon;
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