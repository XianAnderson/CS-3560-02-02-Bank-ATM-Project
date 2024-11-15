// dbConnect.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'your_password',
    database: 'useraccounts',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306
});

// Test function to check the database connection
connection.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});


// Call the test function
//testConnection();

module.exports = connection.promise();
