CREATE TABLE UserAccount (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    balance DECIMAL(10, 2),
    accountStatus VARCHAR(50),
    phoneNumber VARCHAR(15),
    address VARCHAR(255),
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    transactionList JSON,
    accountType ENUM('Checking', 'Savings', 'CreditLine') NOT NULL
);

CREATE TABLE Transaction (
    transactionId INT AUTO_INCREMENT PRIMARY KEY,
    transactionType ENUM('Withdrawal', 'Deposit', 'Transfer', 'ViewBalance'),
    amount DECIMAL(10, 2),
    transactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    sourceAccount INT,
    destinationAccount INT,
    status ENUM('Pending', 'Completed', 'Failed'),
    FOREIGN KEY (sourceAccount) REFERENCES UserAccount(accountId),
    FOREIGN KEY (destinationAccount) REFERENCES UserAccount(accountId)
);


CREATE TABLE ATM (
    atmId INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    cashReserveLevel DECIMAL(10, 2),
    status ENUM('Active', 'Inactive'),
    lastServiceDate DATETIME
);

CREATE TABLE ATM_TransactionHistory (
    atmTransactionId INT AUTO_INCREMENT PRIMARY KEY,
    atmId INT,
    transactionId INT,
    FOREIGN KEY (atmId) REFERENCES ATM(atmId),
    FOREIGN KEY (transactionId) REFERENCES Transaction(transactionId)
);

CREATE TABLE UserCard (
    cardId INT AUTO_INCREMENT PRIMARY KEY,
    accountId INT,
    cardType ENUM('Debit', 'Credit'),
    expirationDate DATE,
    securityCode INT,
    PIN VARCHAR(6) NOT NULL,
    FOREIGN KEY (accountId) REFERENCES UserAccount(accountId)
);

CREATE TABLE CashReserve (
    cashReserveId INT AUTO_INCREMENT PRIMARY KEY,
    totalAmount DECIMAL(10, 2),
    restockDate DATETIME,
    emptyStatus BOOLEAN,
    atmId INT,
    FOREIGN KEY (atmId) REFERENCES ATM(atmId)
);

CREATE TABLE CashReserve_Denomination (
    denominationId INT AUTO_INCREMENT PRIMARY KEY,
    cashReserveId INT,
    denominationValue INT,
    denominationCount INT,
    FOREIGN KEY (cashReserveId) REFERENCES CashReserve(cashReserveId)
);

CREATE TABLE ChangePIN (
    changeId INT AUTO_INCREMENT PRIMARY KEY,
    cardId INT,
    currentPIN VARCHAR(6),
    newPIN VARCHAR(6),
    attempts INT DEFAULT 0,
    lastChangedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cardId) REFERENCES UserCard(cardId)
);

CREATE TABLE ATM_MaintenanceSchedule (
    scheduleId INT AUTO_INCREMENT PRIMARY KEY,
    atmId INT,
    maintenanceDate DATETIME,
    typeOfService ENUM('CashRestock', 'Repair', 'Inspection'),
    workerId INT,
    status ENUM('Scheduled', 'Completed', 'Cancelled'),
    FOREIGN KEY (atmId) REFERENCES ATM(atmId)
);

CREATE TABLE ATM_TransactionLogs (
    logId INT AUTO_INCREMENT PRIMARY KEY,
    atmId INT,
    logDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (atmId) REFERENCES ATM(atmId)
);

CREATE TABLE ATM_TransactionLogs_Entry (
    logEntryId INT AUTO_INCREMENT PRIMARY KEY,
    logId INT,
    transactionId INT,
    FOREIGN KEY (logId) REFERENCES ATM_TransactionLogs(logId),
    FOREIGN KEY (transactionId) REFERENCES Transaction(transactionId)
);

