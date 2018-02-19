"use strict";
const Trades = require('../models/trades');

function TradesHandler() {
    this.proposeTrade = (req, res) => {
        const UserHandler = require('./userHandler.server');
        const BooksHandler = require('./booksHandler.server');
        const userHandler = new UserHandler();
        const booksHandler = new BooksHandler();
        
        const goodreadsId = req.params.id;
        const owner_email = req.params.email;
        const offerer_email = req.user.email;
        
        if (owner_email == offerer_email) {
            req.flash('proposal', 'This is your book');
            return res.sendStatus(200);
        }
        
        const newTrade = new Trades({goodreadsId, owner_email, offerer_email, state: 'sended'});
        const getInfoPromises = [
            userHandler.getUserFirstNameByEmail(owner_email),
            userHandler.getUserFirstNameByEmail(offerer_email),
            booksHandler.getBookTitleById(goodreadsId)
        ];
        
        Promise.all(getInfoPromises)
                .then(results => {
                    newTrade.owner_firstName = results[0];
                    newTrade.offerer_firstName = results[1];
                    newTrade.bookTitle = results[2];
                    newTrade.save().then(() => res.sendStatus(200))
                                    .catch(err => res.status(500).send(err));
                })
                .catch(err => res.status(500).send(err));
        
        
    };
    
    this.getTradesOfUser = (req, res) => {
        const user_email = req.user.email;
        Trades.find().or([{owner_email: user_email}, {offerer_email: user_email}])
                        .then(trades => {
                            const response = {
                                usersTradeRequests: [],
                                tradeRequestsForUser: []
                            };
                            trades.forEach(trade => {
                                if (trade.owner_email == user_email) {
                                    response.tradeRequestsForUser.push(trade);
                                }
                                else {
                                    response.usersTradeRequests.push(trade);
                                }
                            });
                            res.json(response);
                        }).catch(err => res.status(500).send(err));
    };
    
    this.deleteAllProposalsOfUser = (user_email) => {
        return new Promise((resolve, reject) => {
            Trades.remove().or([{owner_email: user_email}, {offerer_email: user_email}])
                            .then(() => resolve(200))
                            .catch(err => reject(err));
        });
        
    };
    
    this.deleteAllProposalsOfBook = (goodreadsId, owner_email) => {
        return new Promise((resolve, reject) => {
            Trades.remove({goodreadsId, owner_email})
                    .then(() => resolve(200))
                    .catch(err => reject(err));
        });
    };
    
    this.changeStateOfProposal = (req, res) => {
        const goodreadsId = req.params.id;
        const owner_email = req.user.email;
        const respond = req.params.respond;
        Trades.findOne({goodreadsId, owner_email})
                .tnen(trade => {
                    trade.state = respond;
                    trade.save()
                            .then(() => res.sendStatus(200))
                            .catch(err => res.status(500).send(err));
                }).catch(err => res.status(500).send(err));
    };
    
}

module.exports = TradesHandler;