const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

router.get('/', (req, res) => {
    //code for entering all bills being deposited
    res.render('deposit');
});

router.post('/', (req, res) => {
    //bills being deposited
    let hundreds = req.body.bills100;
    let fifties = req.body.bills50;
    let twenties = req.body.bills20;
    let tens = req.body.bills10;
    let fives = req.body.bills5;
    let ones = req.body.bills1;
    let amount = hundreds * 100 + fifties * 50 + twenties * 20 + tens * 10 + fives * 5 + ones;

    //selection of account similar to withdrawal
    let account = req.body.account
    atmID = 1;

    const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = ?';
    db.query(sql, [atmID], (err, results) => {
        newHundreds = hundreds + results[0].num100;
        newFifties = fifties + results[0].num50;
        newTwenties = twenties + results[0].num20;
        newTens = tens + results[0].num10;
        newFives = fives + results[0].num5;
        newOnes = ones + results[0].num1;

        if (account == 'save') {
            const sql = 'select savingsBalance from useraccount where accountId = ?';
            db.query(sql, [req.params.accountId], (err, results) => {

                newBalance = results[0].savingsBalance + amount;

                const sql = 'update useraccount set savingsBalance = ? where accountId = ?';
                db.query(sql, [newBalance, req.params.accountId], (err, results) => {

                    const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                    db.query(sql, [newHundreds, newFifties, newTwenties, newTens, newFives, newOnes, atmID], (err, results) => {

                        const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                        db.query(sql, ['deposit', amount, 'savings', req.params.accountId, atmID], (err, results) => {
                            console.log("deposit update");
                        });
                    });
                });
            });
        }
        else {
            const sql = 'select checkingBalance from useraccount where accountId = ?';
            db.query(sql, [req.params.accountId], (err, results) => {

                newBalance = results[0].checkingBalance + amount;

                const sql = 'update useraccount set savingsBalance = ? where accountId = ?';
                db.query(sql, [newBalance, req.params.accountId], (err, results) => {

                    const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                    db.query(sql, [newHundreds, newFifties, newTwenties, newTens, newFives, newOnes, atmID], (err, results) => {

                        const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                        db.query(sql, ['deposit', amount, 'checkings', req.params.accountId, atmID], (err, results) => {
                            console.log("deposit update");
                        });
                    });
                });
            });
        }

    })
});



module.exports = router;