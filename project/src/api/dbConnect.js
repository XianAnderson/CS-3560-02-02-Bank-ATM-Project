// dbConnect.js
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'useraccounts',
    port: 3306
});

module.exports = connection;
