// Represents transaction logs for the ATM
class ATMTransactionLogs {
    constructor(accountId, logId, atmId, logDate) {
        this.accountId = accountId;
        this.logId = logId;
        this.atmId = atmId;
        this.transactionList = []; // 1-to-many relationship with Transaction
        this.logDate = logDate;
    }

    addTransaction(transaction) {
        this.transactionList.push(transaction);
    }
}

module.exports = ATMTransactionLogs;
