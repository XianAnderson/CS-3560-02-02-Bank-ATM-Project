// LoginPage.js
import React, { useState } from 'react';
import '../css/loginPage.css';
import monopolyMan from '../images/monopolyMan.jpg';

function LoginPage() {
    const [cardNumber, setCardNumber] = useState('');
    const [pinNumber, setPinNumber] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError(''); // Clear any existing errors

        try {
            const response = await fetch('http://localhost:3000/api/verifyLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardNumber, pinNumber }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('accountID', data.accountID); // Store account ID in local storage
                alert('Login successful!');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <img src={monopolyMan} alt="Monopoly Man" className="bank-logo" />
                <h1>Monopoly Bank</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="PIN Number"
                        value={pinNumber}
                        onChange={(e) => setPinNumber(e.target.value)}
                    />
                    <button onClick={handleLogin}>Sign In</button>
                    <button onClick={() => { setCardNumber(''); setPinNumber(''); }}>Clear</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
