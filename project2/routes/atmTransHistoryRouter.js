const express = require('express');
const router = express.Router();
const { dbconnect } = require('../dbConnection.js');
const db = dbconnect();

// Route to render ATM Transaction History Page
router.get('/:workerID/transHistory', (req, res) => {
    const sql = 'SELECT transactionID, transactionType, amount, sourceAccount, destinationAccount, status, transactionDate FROM transactions WHERE atmID = 1';
    db.query(sql, (err, results) => {
        res.render('atmTransactionHistory', {
            transactions: results,
            workerID: req.params.workerID // Pass workerID explicitly
        });
    });
});

module.exports = router;