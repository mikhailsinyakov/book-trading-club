"use strict";
(function () {
    const isAllBooksPage = location.pathname == '/allBooks';
    const isMyBooksPage = location.pathname == '/myBooks';
    const isSettingsPage = location.pathname == '/settings';
    
    if (isAllBooksPage || isMyBooksPage) booksController.getBooks(domController.addImages);
    if (isMyBooksPage) {
        tradesController.getTradesOfUser(domController.fillTrades);
        domController.toggleRequests();
    }
    else if (isSettingsPage) userController.deleteAccount();
})();