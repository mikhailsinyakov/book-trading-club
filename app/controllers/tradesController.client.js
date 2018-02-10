"use strict";

function TradesController() {
    this.proposeTrade = (booksId, user_email) => {
        const apiUrl = `/api/proposeTrade/${booksId}/${user_email}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("PUT", apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    };
}

const tradesController = new TradesController();