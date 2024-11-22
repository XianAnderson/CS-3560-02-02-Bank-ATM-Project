const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

router.get('/', (req, res) => {
    const sql = 'select checkingBalance, savingsBalance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('Balance for', req.params.accountId);
        res.render('balance', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
    });
});

module.exports = router;