const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

const { dbconnect } = require('./dbConnection.js');
db = dbconnect()

// login page
app.get('/', (req, res) => {
    console.log('index');
    res.render('index');
});

// check if login is valid
app.post('/', (req, res) => {
    let CardNum = req.body.CardNum;
    let PIN = req.body.PIN;
    console.log('trying login with',CardNum,PIN)

    // HERE ARE INSTRUCTIONS ON HOW TO USE SQL QUERY!!!
    // below is the sql query
    // use ? in sql and then put the real variable in []
    // everthing relating to the output of the query should be in the {}
    const sql = 'select accountId, pin from usercard where cardNumber = ?';
    db.query(sql, [CardNum], (err, results) => {
        if (err) {
            console.error('error', err);
        }
        
        if (results.length > 0) {
            if(results[0].pin == PIN) {
                console.log('success logging in');
                res.render('loginRedirect',{accountId : results[0].accountId});
            } else {
                console.log('wrong PIN');
                res.render('index');
            }
        } else {
            console.log('no card found with CardNum');
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