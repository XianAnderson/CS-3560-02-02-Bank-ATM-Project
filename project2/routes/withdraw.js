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

router.post('/', (req, res) => {
    let account = req.body.account;
    let amount = req.body.amount;
    const atmIDLocation = 1;
    overdraft = false;
    console.log('trying to withdraw ', amount , ' from ', account)

    if (account == "check") {
        const sql = 'select checkingBalance from useraccount where accountId = ?';
        db.query(sql, [req.params.accountId], (err, results) => {
           
            //setting vars to int to avoid broken decimal math in javascript

            balance = Math.round(results[0].checkingBalance * 100);
            amount = Math.round(amount * 100);
            //trying to withdraw too much from the account, so must check if possible to even withdraw that much money in later code
            if (balance - amount < 0)
                overdraft = true;
            //you got enough money, so transaction goes through with update at end
            else {
                const sql = 'select 100s, 50s, 20s, 10s, 5s, 1s from atm when atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;
                    maxWith = (hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one)

                    //if not enough cash, get outta dodge
                    if (amount - maxWith < 0) {
                        console.error('atm has insufficient funds')
                        error = "Sorry, the ATM has insufficient funds"
                        res.render('withdrawError', { error: error });
                    }
                    else {
                        validWith = false;
                        denom = [];
                        do {
                            //router stuff here?

                            res.render('withdrawDenom')

                            //code to get minimum denom from site here
                            with100 = 0;
                            with50 = 0;
                            with20 = 0;
                            with10 = 0;
                            with5 = 0;
                            with1 = 0;
                            cashLeftWithdraw = amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1)

                            //check if min denom is possible with amount requested
                            if (cashLeftWithdraw < 0) {
                                //code for excess withdraw
                            }
                            //code for letting them know you can withdraw AT MOST 10 of each
                            else if (with100 > 10 | with50 > 10 | with20 > 10 | with10 > 10 | with5 > 10 | with1 > 10) {
                            }
                            else {
                                with100 = with100 + cashLeftWithdraw / 100;
                                cashLeftWithdraw %= 100;
                                if (with100 > hun) {
                                    cashLeftWithdraw = cashLeftWithdraw + 100 * (with100 - hun)
                                    with100 = hun
                                }

                                with50 = with50 + cashLeftWithdraw / 50;
                                cashLeftWithdraw %= 50;
                                if (with50 > hun) {
                                    cashLeftWithdraw = cashLeftWithdraw + 50 * (with50 - fif)
                                    with50 = fif
                                }

                                with20 = with20 + cashLeftWithdraw / 20;
                                cashLeftWithdraw %= 20;
                                if (with20 > twe) {
                                    cashLeftWithdraw = cashLeftWithdraw + 20 * (with20 - twe);
                                    with20 = twe;
                                }

                                with10 = with10 + cashLeftWithdraw / 10;
                                cashLeftWithdraw %= 10;
                                if (with10 > ten) {
                                    cashLeftWithdraw = cashLeftWithdraw + 10 * (with10 - ten);
                                    with10 = ten;
                                }

                                with5 = with5 + cashLeftWithdraw / 5;
                                cashLeftWithdraw %= 5;
                                if (with5 > fiv) {
                                    cashLeftWithdraw = cashLeftWithdraw + 5 * (with5 - fiv);
                                    with5 = fiv;
                                }

                                with1 += cashLeftWithdraw;
                                if (with1 > one) {
                                    validWith = true;
                                }

                            }
                        } while (!validWith);

                        balance -= amount;
                        //dispense (out of scope)

                        const sql = 'update useraccount set checkingBalance = ? where accountId = ?';
                        db.query(sql, [balance, req.params.accountId], (err, results) => {
                            const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                            db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                                db.query(sql, ['withdrawal', amount, 'checking', req.params.accountId, atmID], (err, results) => {
                                    console.log("withdraw update");
                                });
                            });
                        });
                    }
                });
            }
        });
    }
    else if (account == "save") {
        const sql = 'select savingsBalance from useraccount where accountId = ?';
        db.query(sql, [req.params.accountId], (err, results) => {

            /* flow program
            
            check if enough cash and stop this query if so

            check if enough cash in atm

            ask for min denom wanted (max 10 for 100-20, max 20 for 10-1) and dipense

            update db

            */

            //setting vars to int to avoid broken decimal math in javascript

            balance = Math.round(results[0].savingBalance * 100);
            amount = Math.round(amount * 100);
            //trying to withdraw too much from the account, so must check if possible to even withdraw that much money in later code
            if (balance - amount < 0)
                overdraft = true;
            //you got enough money, so transaction goes through with update at end
            else {
                const sql = 'select 100s, 50s, 20s, 10s, 5s, 1s from atm when atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;
                    maxWith = (hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one)

                    //if not enough cash, get outta dodge
                    if (amount - maxWith < 0) {
                        console.error('atm has insufficient funds')
                        error = "Sorry, the ATM has insufficient funds"
                        res.render('withdrawError', { error: error });
                    }
                    else {
                        validWith = false;
                        do {
                            //router stuff here?

                            res.render('withdrawDenom')

                            //code to get minimum denom from site here
                            with100 = 0;
                            with50 = 0;
                            with20 = 0;
                            with10 = 0;
                            with5 = 0;
                            with1 = 0;

                            //check if min denom is possible with amount requested
                            if (amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1) < 0) {
                                //code for excess withdraw
                            }
                            //check if max for each denom
                            else if (with100 > 10 | with50 > 10 | with20 > 10 | with10 > 10 | with5 > 10 | with1 > 10) {
                                //code for letting them know you can withdraw AT MOST 10 of each
                            }
                            //check if atm can withdraw that much for each bill
                            else if (with100 > hun) {
                                //code for insufficient bills of type in atm
                            }
                            else if (with50 > fif) {
                                //code for insufficient bills of type in atm
                            }
                            else if (with20 > twe) {
                                //code for insufficient bills of type in atm
                            }
                            else if (with10 > ten) {
                                //code for insufficient bills of type in atm
                            }
                            else if (with5 > fif) {
                                //code for insufficient bills of type in atm
                            }
                            else if (with1 > one) {
                                //code for insufficient bills of type in atm
                            }
                            //passed all condition, proceed
                            else
                                validWith = true;
                        } while (!validWith);

                        denom = getDenom(amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1));


                        with100 += denom[0];
                        with50 += denom[1];
                        with20 += denom[2];
                        with10 += denom[3];
                        with5 += denom[4];
                        with1 += denom[5];

                        balance -= amount;

                        //dispense (out of scope)

                        balance / 100;
                        amount / 100;

                        const sql = 'update useraccount set savingsBalance = ? where accountId = ?';
                        db.query(sql, [balance, req.params.accountId], (err, results) => {
                            const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                            db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                const sql = 'insert into transactions (transactionType, amount, sourceAccount, status, accountID, cardID, atmID) values (?, ?, ?, "completed", ?, 1, ?)';
                                db.query(sql, ['withdrawal', amount, 'savings', req.params.accountId, atmID], (err, results) => {
                                    console.log("withdraw update");
                                });
                            });
                        });
                    }
                });
            }
        });
    }
    else {
        console.log("no account selected");
    }

    if (overdraft) {
        const sql = 'select savingsBalance, checkingBalance from useraccount where accountId = ?';
        db.query(sql, [req.params.accountId], (err, results) => {

            //setting vars to int to avoid broken decimal math in javascript
            checkBalance = Math.round(results[0].checkingBalance * 100);
            saveBalance = Math.round(results[0].savingsBalance * 100);
            totalBal = checkBalance + saveBalance;
            amount = Math.round(amount * 100);

            if (amount - totalBal < 0) {
                //insufficient funds in person account, so go to withdraw screen again
                res.render('withdraw', { checkingBalance: results[0].checkingBalance, savingsBalance: results[0].savingsBalance });
            }
            else {
                const sql = 'select 100s, 50s, 20s, 10s, 5s, 1s from atm when atmID = ?'
                db.query(sql, [atmID], (err, results) => {
                    hun = results[0].num100;
                    fif = results[0].num50;
                    twe = results[0].num20;
                    ten = results[0].num10;
                    fiv = results[0].num5;
                    one = results[0].num1;
                    maxWith = (hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one)

                    //if not enough cash, get outta dodge
                    if (amount - maxWith < 0) {
                        console.error('atm has insufficient funds')
                        error = "Sorry, the ATM has insufficient funds"
                        res.render('withdrawError', { error: error });
                    }
                    else {
                        validWith = false;
                        //make sure it is possible to withdraw a certain amount
                        do {
                            //router stuff here?

                            res.render('withdrawDenom')

                            //code to get minimum denom from site here
                            with100 = 0;
                            with50 = 0;
                            with20 = 0;
                            with10 = 0;
                            with5 = 0;
                            with1 = 0;
                            cashLeftWithdraw = amount - (with100 * 100 + with50 * 50 + with20 * 20 + with10 * 10 + with5 * 5 + with1)

                            //check if min denom is possible with amount requested
                            if (cashLeftWithdraw < 0) {
                                //code for excess withdraw
                            }
                            //code for letting them know you can withdraw AT MOST 10 of each
                            else if (with100 > 10 | with50 > 10 | with20 > 10 | with10 > 10 | with5 > 10 | with1 > 10) {
                            }
                            else {
                                with100 = with100 + cashLeftWithdraw / 100;
                                cashLeftWithdraw %= 100;
                                if (with100 > hun) {
                                    cashLeftWithdraw = cashLeftWithdraw + 100 * (with100 - hun)
                                    with100 = hun
                                }

                                with50 = with50 + cashLeftWithdraw / 50;
                                cashLeftWithdraw %= 50;
                                if (with50 > hun) {
                                    cashLeftWithdraw = cashLeftWithdraw + 50 * (with50 - fif)
                                    with50 = fif
                                }

                                with20 = with20 + cashLeftWithdraw / 20;
                                cashLeftWithdraw %= 20;
                                if (with20 > twe) {
                                    cashLeftWithdraw = cashLeftWithdraw + 20 * (with20 - twe);
                                    with20 = twe;
                                }

                                with10 = with10 + cashLeftWithdraw / 10;
                                cashLeftWithdraw %= 10;
                                if (with10 > ten) {
                                    cashLeftWithdraw = cashLeftWithdraw + 10 * (with10 - ten);
                                    with10 = ten;
                                }

                                with5 = with5 + cashLeftWithdraw / 5;
                                cashLeftWithdraw %= 5;
                                if (with5 > fiv) {
                                    cashLeftWithdraw = cashLeftWithdraw + 5 * (with5 - fiv);
                                    with5 = fiv;
                                }

                                with1 += cashLeftWithdraw;
                                if (with1 > one) {
                                    validWith = true;
                                }

                            }
                        } while (!validWith);


                        //dispense (out of scope)

                        if (account == "check") {

                            amount -= checkBalance;
                            saveBalance -= amount;

                            const sql = 'update useraccount set checkingBalance = ?, savingsBalance = ? where accountId = ?';
                            db.query(sql, [0, saveBalance, req.params.accountId], (err, results) => {
                                const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                                db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                    const sql = 'insert into transactions (transactionType, amount, sourceAccount, destinationAccount, status, accountID, cardID, atmID) values ("withdraw", ?, ?, ?, "completed", ?, 1, ?)';
                                    db.query(sql, [amount, 'checkings', 'savings', req.params.accountId, atmID], (err, results) => {
                                        console.log("withdraw update");
                                    });
                                });
                            });
                        }
                        else {

                            amount -= saveBalance;
                            checkBalance -= amount;

                            const sql = 'update useraccount set checkingBalance = ?, savingsBalance = ? where accountId = ?';
                            db.query(sql, [checkBalance, 0, req.params.accountId], (err, results) => {
                                const sql = 'update atm set num100 = ?, num50 = ?, num20 = ?, num10 = ?, num5 = ?, num1 = ? where atmId = ?';
                                db.query(sql, [hun - with100, fif - with100, twe - with20, ten - with10, fif - with5, one - with1, atmID], (err, results) => {
                                    const sql = 'insert into transactions (transactionType, amount, sourceAccount, destinationAccount, status, accountID, cardID, atmID) values ("withdraw", ?, ?, "checkings", "completed", ?, 1, ?)';
                                    db.query(sql, [amount, 'saving', 'checkings',  req.params.accountId, atmID], (err, results) => {
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
});



module.exports = router;