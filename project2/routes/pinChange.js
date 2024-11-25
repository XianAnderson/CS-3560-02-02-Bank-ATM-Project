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

router.post('/', (req, res) => {
    //const { currentPin, newPin, confirmPin } = req.body;
    let currentPin = req.body.currentPin;
    let newPin = req.body.newPin;
    let confirmPin = req.body.confirmPin;
    let accountID = req.params.accountID;
    let cardID = req.params.cardID;

    const sql = 'SELECT pin FROM usercard WHERE accountID = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        try {
            // Verify that the user provided their current PIN
            //const [rows] = db.query('SELECT pin FROM usercard WHERE accountID = ?', [accountID]);
            if (results.length === 0 || results[0].pin !== currentPin) {
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
            console.log('Pin change to', req.body.newPin);
            const sql = 'UPDATE usercard SET pin = ? WHERE cardID = ?';
            db.query(sql, [newPin, cardID], (err, results) => {
                console.log(err,results)
                console.log('Pin updated');
            });
            
    
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
    
});

module.exports = router;