// app.js
const express = require('express');
const path = require('path');
const accountRoutes = require('./routes/accountRoutes'); // Import account routes

const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Serve static files from 'public' directory for the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Use accountRoutes for all /account endpoints
app.use('/account', accountRoutes); // Attach the router to the '/account' route

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
