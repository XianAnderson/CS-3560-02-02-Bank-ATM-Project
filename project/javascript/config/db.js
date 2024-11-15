// config/db.js
const mysql = require('mysql2');

// Create the connection to MySQL
const db = mysql.createConnection({
    host: 'localhost',    // Database host (e.g., localhost)
    user: 'root',         // Database user
    password: 'password', // Database password
    database: 'db_name'    // Database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('MySQL connected...');
});

module.exports = db; // Export the database connection
