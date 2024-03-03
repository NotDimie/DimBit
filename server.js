require('dotenv').config();
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios for API calls

const app = express();
const port = process.env.PORT || 3000; // Use the port from environment or default to 3000

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = []; // Replace with a proper database in production

app.get('/fastrack.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fastrack.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', async (req, res) => { 
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        res.redirect('/fastrack.html');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.redirect('/fastrack.html');
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

// Define the OpenAI API endpoint
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// OpenAI API integration
app.post('/generate_study_plan', async (req, res) => {
    const { grade, topic, time } = req.body;
    try {
        const apiKey = process.env.OPENAI_API_KEY; // Retrieve API key from environment variable
        const params = {
            prompt: `Explain the topic of ${topic} in detail suitable for a Grade ${grade} student. Provide key points that can be covered within ${time} minutes.`,
            max_tokens: 256
        };

        const response = await axios.post(OPENAI_API_ENDPOINT, params, {
            headers: { 
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const studyPlan = response.data.choices[0].text;
        res.json({ studyPlan }); // Send the response back to the client
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'An error occurred while generating the study plan', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});