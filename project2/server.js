const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const { dbconnect } = require('./dbConnection.js');
db = dbconnect();

//Serve static files
app.use('/images', express.static(path.join(__dirname + '/views/images')));

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

    // Make sure login is correct
    const sql = 'select accountId, pin, cardID from usercard where cardNumber = ?';
    db.query(sql, [CardNum], (err, results) => {
        if (err) {
            console.error('error', err);
        }
        
        if (results.length > 0) {
            if(results[0].pin == PIN) {
                console.log('success logging in');
                res.render('loginRedirect',{accountId : results[0].accountId, cardID : results[0].cardID});
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

// Import routes
const adminLoginRouter = require('./routes/adminLogin'); // Admin login route
const atmStatusRouter = require('./routes/atmStatusRouter'); // ATM status route
const atmTransHistoryRouter = require('./routes/atmTransHistoryRouter'); // ATM transaction history route
const fundManagementRoutes = require('./routes/fundManagement'); //ATM restock route

app.use('/admin', adminLoginRouter); // Mount admin routes on /admin
app.use('/admin', atmStatusRouter); // Mount ATM status routes on /admin
app.use('/admin', atmTransHistoryRouter); // Mount ATM transaction history routes on /admin
app.use(fundManagementRoutes)

// select what to do page
app.get('/:accountId/:cardID/home/', (req, res) => {
    const sql = 'select name from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('home for', req.params.accountId);
        res.render('home', {name : results[0].name});
    });
});

// split each sub system into a router
const balanceRouter = require('./routes/balance');
app.use('/:accountId/:cardID/balance',balanceRouter);

const transferRouter = require('./routes/transfer');
app.use('/:accountId/:cardID/transfer',transferRouter);

const pinChangeRouter = require('./routes/pinChange'); 
app.use('/:accountId/:cardID/pinChange', pinChangeRouter);

const withdrawRouter = require('./routes/withdraw');
app.use('/:accountId/:cardID/withdraw', withdrawRouter);

const depositRouter = require('./routes/deposit');
app.use('/:accountId/:cardID/deposit', depositRouter);

app.listen(3000);