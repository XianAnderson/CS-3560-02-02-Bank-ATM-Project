const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

router.get('/', (req, res) => {
    res.render('deposit');
});

router.post('/', (req, res) => {
    //bills being deposited
    var hundreds = parseInt(req.body.bills100);
    var fifties = parseInt(req.body.bills50);
    var twenties = parseInt(req.body.bills20);
    var tens = parseInt(req.body.bills10);
    var fives = parseInt(req.body.bills5);
    var ones = parseInt(req.body.bills1);
    var amount = hundreds * 100 + fifties * 50 + twenties * 20 + tens * 10 + fives * 5 + ones;

    //selection of account similar to withdrawal
    let account = req.body.account
    atmID = 1;

    const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = ?';
    db.query(sql, [atmID], (err, results) => {
        var newHundreds = hundreds + results[0].num100;
        var newFifties = fifties + results[0].num50;
        var newTwenties = twenties + results[0].num20;
        var newTens = tens + results[0].num10;
        var newFives = fives + results[0].num5;
        var newOnes = ones + results[0].num1;

        if (account == 'save') {
            const sql = 'select savingsBalance from useraccount where accountId = ?';
            db.query(sql, [req.params.accountId], (err, results) => {

                newBalance = (Math.round(results[0].savingsBalance * 100) + amount * 100) / 100;

                const sql = 'update useraccount set savingsBalance = ? where accountId = ?';
                db.query(sql, [newBalance, req.params.accountId], (err, results) => {

                    const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                    db.query(sql, [newHundreds, newFifties, newTwenties, newTens, newFives, newOnes, atmID], (err, results) => {

                        const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                        db.query(sql, ['deposit', amount, 'savings', req.params.accountId, atmID], (err, results) => {
                            console.log("deposit update");
                            res.render('deposit');

                        });
                    });
                });
            });
        }
        else {
            const sql = 'select checkingBalance from useraccount where accountId = ?';
            db.query(sql, [req.params.accountId], (err, results) => {

                newBalance = (Math.round(results[0].checkingBalance * 100) + amount * 100) / 100;

                const sql = 'update useraccount set checkingBalance = ? where accountId = ?';
                db.query(sql, [newBalance, req.params.accountId], (err, results) => {

                    const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                    db.query(sql, [newHundreds, newFifties, newTwenties, newTens, newFives, newOnes, atmID], (err, results) => {

                        const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                        db.query(sql, ['deposit', amount, 'checking', req.params.accountId, atmID], (err, results) => {
                            console.log("deposit update");
                            res.render('deposit');

                        });
                    });
                });
            });
        }

    })
});



module.exports = router;