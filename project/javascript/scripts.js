// scripts.js

let accountId = null; // Store accountId after login

// Function to log in by checking card number and PIN
function login() {
    const cardNumber = document.getElementById('cardNumber').value;
    const pin = document.getElementById('pin').value;

    fetch('/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardNumber, pin })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }

        accountId = data.accountId; // Store the authenticated accountId
        document.getElementById('login-section').style.display = 'none';
        getUserAccounts(accountId); // Fetch user accounts
    })
    .catch(error => console.error('Error during login:', error));
}

// Function to get all accounts for the logged-in user
function getUserAccounts(accountId) {
    fetch(`/account/user/${accountId}/accounts`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            document.getElementById('account-list').style.display = 'block';
            const accountsList = document.getElementById('accounts');
            accountsList.innerHTML = '';

            data.accounts.forEach(account => {
                const accountItem = document.createElement('li');
                accountItem.textContent = `${account.accountType} - $${account.balance}`;
                accountItem.onclick = () => viewBalance(account.accountId);
                accountsList.appendChild(accountItem);
            });
        })
        .catch(error => console.error('Error fetching accounts:', error));
}

// Function to view the balance of a specific account
function viewBalance(accountId) {
    fetch(`/account/balance/${accountId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            document.getElementById('balance-display').style.display = 'block';
            document.getElementById('balance').textContent = `Balance: $${data.balance}`;
        })
        .catch(error => console.error('Error fetching balance:', error));
}
