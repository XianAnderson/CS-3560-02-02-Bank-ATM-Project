const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

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
        newChecking = Math.round(results[0].checkingBalance * 100);
        newSaving = Math.round(results[0].savingsBalance * 100);
        amount = Math.round(amount * 100)
        
        if (req.body.direction == 'ctos') {
            if (newChecking - amount >= 0) {
                newChecking -= amount;
                newSaving += amount;
            } else {
                console.error('not enough funds')
            }
        } else if (req.body.direction == 'stoc') {
            if (newSaving - amount >= 0) {
                newSaving -= amount;
                newChecking += amount;
            } else {
                console.error('not enough funds')
            }
        } else {
            console.error('no direction')
        }

        newChecking /= 100
        newSaving /= 100

        const sql = 'update useraccount set checkingBalance = ?, savingsBalance = ? where accountId = ?';
        db.query(sql, [newChecking, newSaving, req.params.accountId], (err, results) => {
            console.error('transfer update')
            res.render('transfer', {checkingBalance : newChecking, savingsBalance : newSaving});
        });
    });
});

module.exports = router;