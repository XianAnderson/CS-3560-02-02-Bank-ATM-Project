// Import Express to create routes
const express = require('express');
// Create a router instance
const router = express.Router();
// Import database connection function
const { dbconnect } = require('../dbConnection.js');
// Establish database connection
const db = dbconnect();

// Route to render the Admin Login Page
router.get('/', (req, res) => {
    const errorMessage = req.query.error || null; // Get the error message from the query parameter
    res.render('adminLogin', { errorMessage }); // Pass the error message to the template
  });
  

// Route to handle login logic for admin
router.post('/login', (req, res) => {
    const { workerUsername, workerPassword } = req.body; // Extract username and password from form submission
  
    // SQL query to find the admin worker by their username
    const sql = 'SELECT workerID, workerPassword FROM admin WHERE workerUsername = ?';
    db.query(sql, [workerUsername], (err, results) => {
      if (err) {
        // Handle database errors
        console.error('Database error:', err);
        res.redirect('/admin?error=Database error. Please try again later.');
      } else if (results.length === 0 || results[0].workerPassword !== workerPassword) {
        // If no results or password does not match, redirect with an error message
        res.redirect('/admin?error=Invalid username and/or password');
      } else {
        // If login is successful, redirect to the admin home page with worker ID
        res.redirect(`/admin/${results[0].workerID}/home`);
      }
    });
  });
  

// Route to render Admin Home Page
router.get('/:workerID/home', (req, res) => {
  const sql = 'SELECT workerName FROM admin WHERE workerID = ?';
  db.query(sql, [req.params.workerID], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          console.error('No worker found with workerID:', req.params.workerID);
          return res.status(404).send('Worker not found');
      }
      res.render('adminHome', {
        workerName: results[0].workerName,
        workerID: req.params.workerID // Pass workerID explicitly
    });
  });
});


module.exports = router; // Export the router for use in server.js
