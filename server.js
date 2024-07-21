const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/keys', (req, res) => {
    res.json({
        openWeatherMapApiKey: process.env.OPENWEATHERMAP_API_KEY,
        openaiApiKey: process.env.OPENAI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});