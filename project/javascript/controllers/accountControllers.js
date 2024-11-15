// controllers/accountController.js
const db = require('../config/db'); // Assuming db.js is in a config folder

// Authenticate user
exports.authenticateUser = (req, res) => {
    const { cardNumber, pin } = req.body;

    db.query(`SELECT accountId FROM UserCard WHERE cardId = ? AND PIN = ?`, [cardNumber, pin], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error authenticating user' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid card number or PIN' });
        }
        
        res.json({ accountId: results[0].accountId });
    });
};

// Fetch user accounts
exports.getUserAccounts = (req, res) => {
    const { accountId } = req.params;

    db.query(`SELECT * FROM UserAccount WHERE accountId = ?`, [accountId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching accounts' });
        }

        res.json({ accounts: results });
    });
};

// View account balance
exports.viewBalance = (req, res) => {
    const { accountId } = req.params;

    db.query(`SELECT balance FROM UserAccount WHERE accountId = ?`, [accountId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching balance' });
        }

        res.json({ balance: results[0].balance });
    });
};
