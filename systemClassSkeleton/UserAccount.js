// Represents the bank account of a customer
class UserAccount {
    constructor(accountId, balance, accountStatus, name, address, phoneNumber, creationDate, accountType) {
        this.accountId = accountId;
        this.balance = balance;
        this.accountStatus = accountStatus;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.creationDate = creationDate;
        this.accountType = accountType; // Example: "checking", "savings", "creditLine"
        this.userCards = []; // 1-to-many relationship with UserCard
        this.transactionList = []; // 1-to-many relationship with Transaction
    }

    addCard(card) {
        this.userCards.push(card);
    }

    addTransaction(transaction) {
        this.transactionList.push(transaction);
    }
}

module.exports = UserAccount;
