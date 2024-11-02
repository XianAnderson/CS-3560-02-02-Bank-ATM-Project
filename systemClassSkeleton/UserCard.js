// Represents a user's ATM card with subclasses for DebitCard and CreditCard
class UserCard {
    constructor(cardId, accountId, cardType, expirationDate, securityCode, PIN) {
        this.cardId = cardId;
        this.accountId = accountId;
        this.cardType = cardType; // Example: "debit", "credit"
        this.expirationDate = expirationDate;
        this.securityCode = securityCode;
        this.PIN = PIN;
        this.transactions = []; // 1-to-many relationship with Transaction
    }

    verifyPIN(inputPIN) {
        return this.PIN === inputPIN;
    }
}

class DebitCard extends UserCard {
    constructor(cardId, accountId, expirationDate, securityCode, PIN) {
        super(cardId, accountId, "debit", expirationDate, securityCode, PIN);
    }
}

class CreditCard extends UserCard {
    constructor(cardId, accountId, expirationDate, securityCode, PIN) {
        super(cardId, accountId, "credit", expirationDate, securityCode, PIN);
    }
}

module.exports = { UserCard, DebitCard, CreditCard };
