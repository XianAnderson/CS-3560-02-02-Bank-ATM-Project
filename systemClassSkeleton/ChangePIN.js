// Represents the PIN change process for the User's Card
class ChangePIN {
    constructor(cardId, currentPIN, newPIN, attempts, lastChangedDate) {
        this.cardId = cardId;
        this.currentPIN = currentPIN;
        this.newPIN = newPIN;
        this.attempts = attempts;
        this.lastChangedDate = lastChangedDate;
    }

    executePINChange() {
        // Logic to update the PIN after verification
    }
}

module.exports = ChangePIN;
