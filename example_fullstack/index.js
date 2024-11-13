const mysql = require('mysql2');
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb", // Change to database name
});

// Route to Execute Raw SQL
app.post("/query", (req, res) => {
    const sql = req.body.sql;
    db.query(sql, (err, results) => {
        res.send({ results });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});