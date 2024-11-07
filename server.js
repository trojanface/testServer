const express = require('express');
const axios = require('axios');
const https = require('https');
require('dotenv').config();  // To load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Disable SSL certificate validation (optional, for testing)
const agent = new https.Agent({
    rejectUnauthorized: false
});

// Route to handle the proxy POST request
app.post('/proxy', async (req, res) => {
    try {
        const receivedData = req.body.data;  // Data sent from the client

        // Step 1: Get the access token
        const tokenUrl = 'https://103.211.209.114:18006/bluize/adapter/loyalty/api/token';
        const tokenData = `grant_type=password&username=${process.env.USERNAME}&password=${process.env.PASSWORD}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

        const tokenConfig = {
            headers: {
                'Accept': 'application/json; version=1.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            httpsAgent: agent
        };

        const tokenResponse = await axios.post(tokenUrl, tokenData, tokenConfig);
        const accessToken = tokenResponse.data.access_token;

        // Step 2: Forward the received data (e.g., create new member)
        const createMemberUrl = 'https://103.211.209.114:18006/bluize/adapter/loyalty/api/client';
        const memberData = JSON.stringify(receivedData);
console.log(memberData)
        const memberConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,  // Use the access token
                'Accept': 'application/json; version=1.1',
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        };

        const memberResponse = await axios.post(createMemberUrl, memberData, memberConfig);
        console.log(memberResponse.data)
        res.status(200).json(memberResponse.data);  // Forward response from the API

    } catch (error) {
        console.error('Error occurred:', error.message);
        console.log(error.message)
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
