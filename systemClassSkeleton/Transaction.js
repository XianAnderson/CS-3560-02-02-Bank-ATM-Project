// Represents a transaction on the User Account
class Transaction {
    constructor(transactionId, transactionType, amount, transactionDate, sourceAccount, destinationAccount, status) {
        this.transactionId = transactionId;
        this.transactionType = transactionType; // Example: "withdrawal", "deposit", "transfer", "viewing"
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.sourceAccount = sourceAccount;
        this.destinationAccount = destinationAccount || null;
        this.status = status;
    }
}

module.exports = Transaction;
