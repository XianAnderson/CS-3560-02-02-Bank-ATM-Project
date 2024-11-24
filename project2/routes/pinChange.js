// pinChange.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const mysql2 = require('mysql2');
const { dbconnect } = require('../dbConnection.js');
db = dbconnect();

router.get('/', (req, res) => {
    const sql = 'SELECT pin FROM usercard WHERE accountID = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('Pin change for', req.params.accountId);
        res.render('pinChange', { pin: results[0].pin, success: null, error: null });
    });
});

router.post('/', async (req, res) => {
    //const { currentPin, newPin, confirmPin } = req.body;
    const currentPin = req.body.currentPin;
    const newPin = req.body.newPin;
    const confirmPin = req.body.confirmPin;
    const accountID = req.params.accountID;
    const cardID = req.params.cardID;

    try {
        // Verify that the user provided their current PIN
        const [rows] = await db.query('SELECT pin FROM usercard WHERE accountID = ?', [accountID]);
        if (rows.length === 0 || rows[0].userPin !== currentPin) {
            return res.render('pinChange', {
                accountID,
                success: null,
                error: 'Incorrect current PIN.',
            });
        }

        // Verify that the new PIN and confirm PIN match
        if (newPin !== confirmPin) {
            return res.render('pinChange', {
                accountID,
                success: null,
                error: 'New PIN and confirmation PIN do not match.',
            });
        }

        // Update the database with the new PIN
        await db.query('UPDATE usercard SET pin = ? WHERE accountID = ?', [newPin, accountID]);

        // Render success message
        return res.render('pinChange', {
            accountID,
            success: 'PIN successfully updated!',
            error: null,
        });
    } catch (error) {
        console.error('Error updating PIN:', error);
        return res.render('pinChange', {
            accountID,
            success: null,
            error: 'An error occurred while updating the PIN.',
        });
    }
});

module.exports = router;