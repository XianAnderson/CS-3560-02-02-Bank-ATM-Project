const express = require('express');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db_name", // not sure if we should change the db name or just use this as the name
});

// login page
app.get('/', (req, res) => {
    console.log('index');
    res.render('index');
});

// check if login is valid
app.post('/', (req, res) => {
    let CardID = req.body.CardID;
    let PIN = req.body.PIN;
    console.log('trying login with',CardID,PIN)

    // HERE ARE INSTRUCTIONS ON HOW TO USE SQL QUERY!!!
    // below is the sql query
    // use ? in sql and then put the real variable in []
    // everthing relating to the output of the query should be in the {}
    const sql = 'select accountId, PIN from usercard where cardID = ?';
    db.query(sql, [CardID], (err, results) => {
        if (err) {
            console.error('error', err);
        }
        
        if (results.length > 0) {
            if(results[0].PIN == PIN) {
                console.error('success logging in');
                res.render('loginRedirect',{accountId : results[0].accountId});
            } else {
                console.error('wrong PIN');
                res.render('index');
            }
        } else {
            console.error('no card found with cardID');
            res.render('index');
        }
    });
});

// select what to do page
app.get('/:accountId/home/', (req, res) => {
    const sql = 'select name from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('home for', req.params.accountId);
        res.render('home', {name : results[0].name});
    });
});

// we should split each sub system into a router
const userRouter = require('./routes/balance');
app.use('/:accountId/balance',userRouter);

app.listen(3000);