const express = require('express');
const router = express.Router();
const { dbconnect } = require('../dbConnection.js');
const db = dbconnect();

// Route to render ATM Status Page
router.get('/:workerID/status', (req, res) => {
    const sql = 'select num100, num50, num20, num10, num5, num1 from atm where atmID = 1';
    let atmID = 1;
    db.query(sql, [atmID], (err, results) => {
        hun = results[0].num100;
        fif = results[0].num50;
        twe = results[0].num20;
        ten = results[0].num10;
        fiv = results[0].num5;
        one = results[0].num1;
        maxWith = (hun * 100 + fif * 50 + twe * 20 + ten * 10 + fiv * 5 + one);
        let total = (maxWith/20000) * 100;
      res.render('atmStatus', {
        status: total,
        workerID: req.params.workerID // Pass workerID explicitly
    });
  });
});

module.exports = router;