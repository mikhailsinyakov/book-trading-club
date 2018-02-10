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
        
        Users.find({}, (err, users) => {
            if (err) return res.status(500).send(err);
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
            
        });
    };
    
    this.deleteAllProposalsOfUser = (req, res) => {
        const user_email = req.user.email;
        Users.find({}, (err, users) => {
            if (err) return res.status(500).send(err);
            
            let linkedUsers = users.filter(user => {
                return user.usersTradeRequests.filter(val => val.owner_email == user_email).length ||
                       user.tradeRequestsForUser.filter(val => val.offerer_email == user_email).length;
            });
            
            linkedUsers = linkedUsers.map(user => {
                for (let key in user) {
                    if (key == "usersTradeRequests") {
                        user[key] = user[key].filter(val => val.owner_email != user_email);
                    }
                    if (key == "tradeRequestsForUser") {
                        user[key] = user[key].filter(val => val.offerer_email != user_email);
                    }
                }
                return user;
            });
            
            const savePromises = [];
            linkedUsers.forEach(user => savePromises.push(user.save()));
            
            Promise.all(savePromises)
                    .then(() => res.sendStatus(200))
                    .catch(err => res.status(500).send(err));
            
        });
    };
}

module.exports = TradesHandler;