// Represents an ATM Machine
class ATM {
    constructor(atmId, location, cashReserveLevel, status, lastServiceDate) {
        this.atmId = atmId;
        this.location = location;
        this.cashReserveLevel = cashReserveLevel;
        this.status = status;
        this.lastServiceDate = lastServiceDate;
        this.transactionList = []; // 1-to-many relationship with Transaction
        this.cashReserves = []; // 1-to-many relationship with CashReserve
    }

    addTransaction(transaction) {
        this.transactionList.push(transaction);
    }

    addCashReserve(cashReserve) {
        this.cashReserves.push(cashReserve);
    }
}

module.exports = ATM;
