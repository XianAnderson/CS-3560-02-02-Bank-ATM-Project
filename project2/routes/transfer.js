const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

// show transfer options
router.get('/', (req, res) => {
    const sql = 'select checkingBalance, savingsBalance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('Transfer for', req.params.accountId);
        res.render('transfer', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
    });
});

// do transfer
router.post('/', (req, res) => {
    let direction = req.body.direction;
    let amount = req.body.amount;
    console.log('trying transfer with',direction,amount);

    const sql = 'select checkingBalance, savingsBalance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        // javascript decimal math is broken, so multiply by 100 to use int math
        newChecking = Math.round(results[0].checkingBalance * 100);
        newSaving = Math.round(results[0].savingsBalance * 100);
        amount = Math.round(amount * 100)
        
        // ensure transfer can happen and set the direction
        if (req.body.direction == 'ctos') {
            if (newChecking - amount >= 0) {
                newChecking -= amount;
                newSaving += amount;
                scource = 'checkings'
                destination = 'savings'
            } else {
                console.error('not enough funds')
                res.render('transfer', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
            }
        } else if (req.body.direction == 'stoc') {
            if (newSaving - amount >= 0) {
                newSaving -= amount;
                newChecking += amount;
                scource = 'savings'
                destination = 'checkings'
            } else {
                console.error('not enough funds')
                res.render('transfer', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
            }
        } else {
            console.error('no direction')
            res.render('transfer', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
        }

        newChecking /= 100
        newSaving /= 100
        amount /= 100

        // do transfer in database
        const sql = 'update useraccount set checkingBalance = ?, savingsBalance = ? where accountId = ?';
        db.query(sql, [newChecking, newSaving, req.params.accountId], (err, results) => {
            const sql = 'insert into transactions (transactionType, amount, sourceAccount, destinationAccount, status, accountID, cardID, atmID) values ("transfer", ?, ?, ?, "completed", ?, ?, 1)';
            db.query(sql, [amount, scource, destination, req.params.accountId, req.params.cardID], (err, results) => {
                console.log('transfer update')
                //console.log(results)
                res.render('transfer', {checkingBalance : newChecking, savingsBalance : newSaving});
            });
        });
    });
});

module.exports = router;