const express = require('express');
const mysql2 = require('mysql2');
const router = express.Router({ mergeParams: true });

const { dbconnect } = require('../dbConnection.js');
db = dbconnect();


// show withdraw options
router.get('/', (req, res) => {
    const sql = 'select checkingBalance, savingsBalance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        console.log('Withdraw from', req.params.accountId);
        res.render('withdraw', {checkingBalance : results[0].checkingBalance, savingsBalance : results[0].savingsBalance});
    });
});

var overdraft = false;
var account;


router.post('/', (req, res) => {
    account = req.body.account;
    let amount = parseInt(req.body.amount);
    let with100 = parseInt(req.body.amount100);
    let with50 = parseInt(req.body.amount50);
    let with20 = parseInt(req.body.amount20);
    let with10 = parseInt(req.body.amount10);
    let with5 = parseInt(req.body.amount5);
    let with1 = parseInt(req.body.amount1);

    
    const atmID = 1;

    var overdraft = false;


    if (account == "check") {
        console.log('trying to withdraw', amount, 'from', account);

        const sql = 'select checkingBalance from useraccount where accountId = ?';
        db.query(sql, [req.params.accountId], (err, results) => {

            balance = Math.round(results[0].checkingBalance * 100);

            if (amount < with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1) {
                console.log('denom too high');
            }
            //trying to withdraw too much from the account, so must check if possible to even withdraw that much money in later code
            else if (balance - amount * 100 < 0)
                overdraft = true;
            //you got enough money, so transaction goes through with update at end
            else {
                const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;


                    if (hun < with100 | fif < with50 | twe < with20 | ten < with10 | fiv < with5 | one < with1) {
                        console.error('atm has insufficient bills')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    //if not enough cash
                    else if ((hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one) - amount < 0) {
                        console.error('atm has insufficient funds')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    else {
                        var floor = Math.floor;
                        cashLeft = amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1);

                        with100 = with100 + floor(cashLeft / 100);
                        cashLeft = cashLeft % 100;
                        if (hun < with100) {
                            cashLeft += (with100 - hun);
                            with100 = hun;
                        }

                        with50 = with50 + floor(cashLeft / 50);
                        cashLeft = cashLeft % 50;
                        if (hun < with50) {
                            cashLeft += (with50 - fif);
                            with50 = fif;
                        }

                        with20 = with20 + floor(cashLeft / 20);
                        cashLeft = cashLeft % 20;
                        if (twe < with20) {
                            cashLeft += (with20 - twe);
                            with20 = twe;
                        }

                        with10 = with10 + floor(cashLeft / 10);
                        cashLeft = cashLeft % 10;
                        if (ten < with10) {
                            cashLeft += (with10 - ten);
                            with10 = ten;
                        }

                        with5 = with5 + floor(cashLeft / 5);
                        cashLeft = cashLeft % 5;
                        if (fif < with5) {
                            cashLeft += (with5 - fiv);
                            with5 = fiv;
                        }

                        with1 = cashLeft;

                        if (one < with1) {
                            console.error('atm has insufficient bills for that denom')
                            res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                        }
                        else {

                            //dispense (out of scope)

                            //take away amount, and bring balance back to float
                            balance -= (amount * 100);
                            balance /= 100;
                            checkBal = balance;

                            console.log(checkBal);

                            const sql = 'update useraccount set checkingBalance = ? where accountId = ?';
                            db.query(sql, [balance, req.params.accountId], (err, results) => {
                                const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                                db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                    const sql = "INSERT INTO transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) VALUES (?, ?, ?, ?, ?, 1, ?)";
                                    db.query(sql, ['withdrawal', amount, 'checkings', 'completed', req.params.accountId, atmID], (err, results) => {
                                        console.log("withdraw update");
                                    });
                                });
                            });
                        }
                    }
                });
            }
        });
    }

    else if (account == "save") {
        const sql = 'select savingsBalance from useraccount where accountId = ?';
        db.query(sql, [req.params.accountId], (err, results) => {
             
            balance = Math.round(results[0].savingsBalance * 100);

            if (amount < with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1) {
                console.log('denom too high');
            }
            //trying to withdraw too much from the account, so must check if possible to even withdraw that much money in later code
            else if (balance - amount * 100 < 0)
                overdraft = true;
            //you got enough money, so transaction goes through with update at end
            else {
                const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;


                    if (hun < with100 | fif < with50 | twe < with20 | ten < with10 | fiv < with5 | one < with1) {
                        console.error('atm has insufficient bills')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    //if not enough cash
                    else if ((hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one) - amount < 0) {
                        console.error('atm has insufficient funds')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    else {
                        var floor = Math.floor;
                        cashLeft = amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1);
                        console.log(cashLeft);

                        with100 = with100 + floor(cashLeft / 100);
                        cashLeft = cashLeft % 100;
                        if (hun < with100) {
                            cashLeft += (with100 - hun);
                            with100 = hun;
                        }

                        with50 = with50 + floor(cashLeft / 50);
                        cashLeft = cashLeft % 50;
                        if (hun < with50) {
                            cashLeft += (with50 - fif);
                            with50 = fif;
                        }

                        with20 = with20 + floor(cashLeft / 20);
                        cashLeft = cashLeft % 20;
                        if (twe < with20) {
                            cashLeft += (with20 - twe);
                            with20 = twe;
                        }

                        with10 = with10 + floor(cashLeft / 10);
                        cashLeft = cashLeft % 10;
                        if (ten < with10) {
                            cashLeft += (with10 - ten);
                            with10 = ten;
                        }

                        with5 = with5 + floor(cashLeft / 5);
                        cashLeft = cashLeft % 5;
                        if (fif < with5) {
                            cashLeft += (with5 - fiv);
                            with5 = fiv;
                        }

                        with1 = cashLeft;

                        if (one < with1) {
                            console.error('atm has insufficient bills for that denom')
                            res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                        }
                        else {

                            //dispense (out of scope)

                            //take away amount, and bring balance back to float
                            balance -= (amount * 100);
                            balance /= 100;

                            saveBal = balance;


                            const sql = 'update useraccount set savingsBalance = ? where accountId = ?';
                            db.query(sql, [balance, req.params.accountId], (err, results) => {
                                const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                                db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                    const sql = "INSERT INTO transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) VALUES (?, ?, ?, ?, ?, 1, ?)";
                                    db.query(sql, ['withdrawal', amount, 'savings', 'completed', req.params.accountId, atmID], (err, results) => {
                                        console.log("withdraw update");
                                    });
                                });
                            });
                        }
                    }
                });
            }
        });
    }
    else {
        console.log("no account selected");
    }


    const sql = 'select savingsBalance, checkingBalance from useraccount where accountId = ?';
    db.query(sql, [req.params.accountId], (err, results) => {
        if (!overdraft) {
            res.redirect('home');
        }
        //if amount was greater than account selected
        else {

            //setting vars to int to avoid broken decimal math in javascript
            checkBalance = Math.round(results[0].checkingBalance * 100);
            saveBalance = Math.round(results[0].savingsBalance * 100);
            var totalBal = checkBalance + saveBalance;

            if (totalBal - amount * 100< 0) {
                //insufficient funds in person account, so go to withdraw screen again
                res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
            }
            else {
                const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;


                    if (hun < with100 | fif < with50 | twe < with20 | ten < with10 | fiv < with5 | one < with1) {
                        console.error('atm has insufficient bills')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    //if not enough cash
                    else if ((hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one) - amount < 0) {
                        console.error('atm has insufficient funds')
                        res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                    }
                    else {
                        var floor = Math.floor;
                        cashLeft = amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1);

                        with100 = with100 + floor(cashLeft / 100);
                        cashLeft = cashLeft % 100;
                        if (hun < with100) {
                            cashLeft += (with100 - hun);
                            with100 = hun;
                        }

                        with50 = with50 + floor(cashLeft / 50);
                        cashLeft = cashLeft % 50;
                        if (hun < with50) {
                            cashLeft += (with50 - fif);
                            with50 = fif;
                        }

                        with20 = with20 + floor(cashLeft / 20);
                        cashLeft = cashLeft % 20;
                        if (twe < with20) {
                            cashLeft += (with20 - twe);
                            with20 = twe;
                        }

                        with10 = with10 + floor(cashLeft / 10);
                        cashLeft = cashLeft % 10;
                        if (ten < with10) {
                            cashLeft += (with10 - ten);
                            with10 = ten;
                        }

                        with5 = with5 + floor(cashLeft / 5);
                        cashLeft = cashLeft % 5;
                        if (fif < with5) {
                            cashLeft += (with5 - fiv);
                            with5 = fiv;
                        }

                        with1 = cashLeft;

                        if (one < with1) {
                            console.error('atm has insufficient bills for that denom')
                            res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
                        }
                        else {

                            //dispense (out of scope)


                            //take away amount, and bring balance back to float
                            if (account == 'save') {
                                totalBal = amount *100 - saveBalance;
                                saveBalance = 0;
                                checkBalance = (checkBalance - totalBal) / 100;
                                source = 'savings';
                                dest = 'checkings';
                            }
                            else {
                                totalBal = amount * 100 - checkBalance;
                                checkBalance = 0;
                                saveBalance = (saveBalance - totalBal) / 100;
                                source = 'checkings';
                                dest = 'savings';
                            }


                            const sql = 'update useraccount set checkingBalance = ?, savingsBalance = ? where accountId = ?';
                            db.query(sql, [checkBalance, saveBalance, req.params.accountId], (err, results) => {
                                const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                                db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                    const sql = "INSERT INTO transactions (transactionType, amount, sourceAccount, destinationAccount, status, accountID, cardID, atmID) VALUES (?, ?, ?, ?, ?, 1, ?)";
                                    db.query(sql, ['withdrawal', amount, source, dest, 'completed', req.params.accountId, atmID], (err, results) => {
                                        console.log("withdraw update");
                                        res.redirect('home');
                                    });
                                });
                            });
                        }
                    }
                });
            }
        }
    });
});
    



module.exports = router;