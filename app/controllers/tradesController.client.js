"use strict";

function TradesController() {
    this.proposeTrade = (booksId, user_email) => {
        const apiUrl = `/api/proposeTrade/${booksId}/${user_email}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("PUT", apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    };
    
    this.getTradesOfUser = callback => {
        const apiUrl = `/api/getTradesOfUser`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET", apiUrl, (status, data) => {
            if (status == 200) {
                data = JSON.parse(data);
                callback(data);
            }
        }));
    };
    
    this.respondToProposal = (booksId, user_email, respond) => {
        const apiUrl = `/api/respondToProposal/${booksId}/${user_email}/${respond}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("PUT", apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    };
    
    this.approveTrade = booksId => {
        const apiUrl = `/api/approveTrade/${booksId}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("PUT", apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    };
    
    this.denyTrade = booksId => {
        const apiUrl = `/api/denyTrade/${booksId}`;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest("PUT", apiUrl, (status, data) => {
            if (status == 200) location.reload();
        }));
    }
}

const tradesController = new TradesController();