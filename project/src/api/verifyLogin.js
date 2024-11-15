// verifyLogin.js
const express = require('express');
const router = express.Router();
const db = require('./dbConnect');

router.post('/api/verifyLogin', (req, res) => {
    const { cardNumber, pinNumber } = req.body;
    const query = 'SELECT accountID FROM userCard WHERE cardNumber = ? AND PIN = ?';

    db.query(query, [cardNumber, pinNumber], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database error', error: err });
        } else if (results.length > 0) {
            // Login successful
            res.status(200).json({ success: true, accountID: results[0].accountID });
        } else {
            // Invalid credentials
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

module.exports = router;
