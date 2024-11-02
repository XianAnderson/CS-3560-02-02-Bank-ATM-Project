// Represents the cash storage within the ATM
class CashReserve {
    constructor(cashReserveId, totalAmount, denominationBreakdown, restockDate, emptyStatus) {
        this.cashReserveId = cashReserveId;
        this.totalAmount = totalAmount;
        this.denominationBreakdown = denominationBreakdown; // Object representing different denominations
        this.restockDate = restockDate;
        this.emptyStatus = emptyStatus;
    }
}

module.exports = CashReserve;
