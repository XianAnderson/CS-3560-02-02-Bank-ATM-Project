const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_name", // not sure if we should change the db name or just use this as the name
});

router.get('/', (req, res) => {
    const sql = 'select balance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('Balance for', req.params.accountId);
        res.render('balance', {balance : results[0].balance});
    });
});

module.exports = router;