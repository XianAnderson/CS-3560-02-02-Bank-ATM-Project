// Importing necessary libraries for database connection (using MySQL as specified)
const mysql = require('mysql');

// Database connection setup (example configuration)
const db = mysql.createConnection({
    host: "localhost",
    user: "yourUsername",
    password: "yourPassword",
    database: "atm_system"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

// Class representing a User's Bank Account
class Account {
    constructor(accountNumber, balance) {
        this.accountNumber = accountNumber; // String: Unique account identifier
        this.balance = balance; // Number: Current balance of the account
    }

    // Method to view balance
    viewBalance() {
        // Returns the current balance of the account
        return this.balance;
    }

    // Method to withdraw money
    withdraw(amount) {
        // Parameters: amount (Number) - amount to withdraw
        // Returns: Boolean - true if successful, false if insufficient funds

        if (amount > this.balance) return false;
        this.balance -= amount;
        // Update balance in database
        // e.g., db.query(`UPDATE accounts SET balance = ${this.balance} WHERE accountNumber = '${this.accountNumber}'`);
        return true;
    }

    // Method to deposit cash
    depositCash(amount) {
        // Parameters: amount (Number) - amount to deposit
        // Returns: new balance after deposit (Number)

        this.balance += amount;
        // Update balance in database
        // e.g., db.query(`UPDATE accounts SET balance = ${this.balance} WHERE accountNumber = '${this.accountNumber}'`);
        return this.balance;
    }

    // Method to deposit a check
    depositCheck(amount) {
        // Parameters: amount (Number) - amount of the check to deposit
        // Returns: new balance after deposit (Number)

        this.balance += amount;
        // Update balance in database
        return this.balance;
    }

    // Method to transfer money between user's accounts
    transferFunds(amount, targetAccount) {
        // Parameters: amount (Number) - amount to transfer, targetAccount (Account) - account to transfer to
        // Returns: Boolean - true if successful, false if insufficient funds

        if (amount > this.balance) return false;
        this.balance -= amount;
        targetAccount.balance += amount;
        // Update balances in database
        return true;
    }
}

// Class representing an ATM Card
class Card {
    constructor(cardNumber, pin) {
        this.cardNumber = cardNumber; // String: Card number
        this.pin = pin; // String: Card PIN for authentication
    }

    // Method to verify the card with pin
    verifyPin(inputPin) {
        // Parameters: inputPin (String) - PIN entered by the user
        // Returns: Boolean - true if PIN is correct, false otherwise

        return this.pin === inputPin;
    }

    // Method to change pin
    changePin(newPin) {
        // Parameters: newPin (String) - new PIN for the card
        // Returns: Boolean - true if PIN change is successful

        this.pin = newPin;
        // Update PIN in database
        return true;
    }
}

// Class representing an ATM Machine
class ATM {
    constructor() {
        this.cashReserve = 10000; // Number: Cash reserve available in the ATM for withdrawals
    }

    // Method to allow users to withdraw cash
    withdrawCash(account, amount) {
        // Parameters: account (Account) - user's account, amount (Number) - amount to withdraw
        // Returns: Boolean - true if successful, false otherwise

        if (amount > this.cashReserve || !account.withdraw(amount)) return false;
        this.cashReserve -= amount;
        // Update cash reserve in database
        return true;
    }

    // Method to allow maintenance workers to remove cash from ATM reserve
    removeCash(amount) {
        // Parameters: amount (Number) - amount to remove
        // Returns: Boolean - true if successful, false if insufficient cash reserve

        if (amount > this.cashReserve) return false;
        this.cashReserve -= amount;
        return true;
    }

    // Method to allow maintenance workers to add cash to ATM reserve
    addCash(amount) {
        // Parameters: amount (Number) - amount to add
        // Returns: new cash reserve amount (Number)

        this.cashReserve += amount;
        return this.cashReserve;
    }
}

// Class representing a User interacting with the ATM system
class User {
    constructor(name, card, accounts) {
        this.name = name; // String: User's name
        this.card = card; // Card: User's ATM card
        this.accounts = accounts; // Array of Account: List of user's bank accounts
    }

    // Method to authenticate user with card and pin
    authenticate(pin) {
        // Parameters: pin (String) - entered PIN
        // Returns: Boolean - true if PIN matches, false otherwise

        return this.card.verifyPin(pin);
    }

    // Method to view account balance
    viewAccountBalance(account) {
        // Parameters: account (Account) - user's account
        // Returns: account balance (Number)

        return account.viewBalance();
    }
}

module.exports = { Account, Card, ATM, User };
