// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Define routes for account actions
router.post('/login', accountController.authenticateUser);
router.get('/user/:accountId/accounts', accountController.getUserAccounts);
router.get('/account/balance/:accountId', accountController.viewBalance);

module.exports = router;
