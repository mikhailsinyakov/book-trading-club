"use strict";
const Users = require('../models/users');

function TradesHandler() {
    this.proposeTrade = (req, res) => {
        const user_email = req.user.email;
        const owner_email = req.params.email;
        const goodreadsId = req.params.id;
        
        if (owner_email == user_email) {
            req.flash('proposal', 'This is your book');
            return res.sendStatus(200);
        }
        
        Users.find({})
                .then(users => {
                    const askingUser = users.filter(user => user.email == user_email)[0];
                    const ownerUser = users.filter(user => user.email == owner_email)[0];
                    const wasProposal = askingUser.usersTradeRequests.filter(val => val.owner_email == owner_email 
                                                                                 && val.goodreadsId == goodreadsId).length;
                    if (wasProposal) {
                        req.flash('proposal', 'You have already asked for this book');
                        return res.sendStatus(200);
                    }
                    
                    askingUser.usersTradeRequests.push({
                        state: 'sended',
                        owner_email: owner_email,
                        goodreadsId
                    });
                    
                    ownerUser.tradeRequestsForUser.push({
                        state: 'sended',
                        offerer_email: user_email,
                        goodreadsId
                    });
                    
                    const saveAskingUserPromise = askingUser.save();
                    const saveOwnerUserPromise = ownerUser.save();
                    
                    Promise.all([saveAskingUserPromise, saveOwnerUserPromise])
                            .then(() => res.sendStatus(200))
                            .catch(err => res.status(500).send(err));
                    
                })
                .catch(err => res.status(500).send(err));
    };
    
    this.deleteAllProposalsOfUser = (user_email) => {
        return new Promise((resolve, reject) => {
            Users.find({}).then(users => {
                let linkedUsers = users.filter(user => {
                    return user.tradeRequestsForUser.filter(val => val.offerer_email == user_email).length;
                });
                
                linkedUsers = linkedUsers.map(user => {
                    user.tradeRequestsForUser = user.tradeRequestsForUser.filter(val => val.offerer_email != user_email);
                    return user;
                });
                
                const savePromises = [];
                linkedUsers.forEach(user => savePromises.push(user.save()));
                
                Promise.all(savePromises)
                        .then(() => resolve(200))
                        .catch(err => reject(err));
                
            }).catch((err) => reject(err));
        });
        
    };
    
    this.deleteAllProposalsOfBook = (goodreadsId, user_email) => {
        return new Promise((resolve, reject) => {
            Users.find({}).then(users => {
                let linkedUsers = users.filter(user => {
                    return user.usersTradeRequests.filter(val => {
                                return val.owner_email == user_email 
                                    && val.goodreadsId == goodreadsId;
                                }).length
                        || user.tradeRequestsForUser.filter(val => {
                                return val.goodreadsId == goodreadsId;
                                }).length;
                });
                
                linkedUsers = linkedUsers.map(user => {
                    user.usersTradeRequests = user.usersTradeRequests.filter(val => {
                        return val.owner_email != user_email 
                            || val.goodreadsId != goodreadsId;
                    });
                    user.tradeRequestsForUser = user.tradeRequestsForUser.filter(val => {
                        return val.goodreadsId != goodreadsId;
                    });
                    return user;
                });
                
                const savePromises = [];
                linkedUsers.forEach(user => savePromises.push(user.save()));
                
                Promise.all(savePromises)
                        .then(() => resolve(200))
                        .catch(err => reject(err));
                
            }).catch((err) => reject(err));
        });
    };
}

module.exports = TradesHandler;