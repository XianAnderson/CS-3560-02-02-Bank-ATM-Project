// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const verifyLogin = require('./src/api/verifyLogin');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(verifyLogin);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
