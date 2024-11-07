const express = require('express');
const app = express();
app.use(express.json());

// Endpoint to receive requests and log data
app.post('/proxy', (req, res) => {
    console.log('Received request:', req.body);
    
    // Respond with a success message
    res.status(200).json({ message: 'Data received and logged successfully.' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
