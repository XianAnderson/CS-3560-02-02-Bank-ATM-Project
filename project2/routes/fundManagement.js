// Import Express to create routes
const express = require('express');
// Create a router instance
const router = express.Router();
const mysql2 = require('mysql2');
// Import database connection function
const { dbconnect } = require('../dbConnection.js');
// Establish database connection
const db = dbconnect();

// Route to render the ATM fund management page
router.get('/admin/:workerID/fundManagement', (req, res) => {
  const sql = 'SELECT totalAmount from atm where atmID = 1'; // Fetch the current ATM fund details
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('fundManagement', {
      workerID: req.params.workerID,
      funds: results, // Pass the current ATM fund details to the template
    });
  });
});

// Route to handle replenishing ATM funds
router.post('/admin/:workerID/fundManagement', (req, res) => {
  const { atmID, totalAmount } = req.body;  // Get the ATM ID and amount from the form
  const sql = 'UPDATE atm SET 100s = 100s + ? WHERE atmID = ?';

  db.query(sql, [totalAmount, atmID], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect(`/admin/${req.params.workerID}/fundManagement`);
  });
});

module.exports = router; // Export the router for use in server.js
