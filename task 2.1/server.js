// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();

// Middleware to parse form data & serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve the form page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/subscribe', (req, res) => {
    const email = req.body.email;

    // Validate input
    if (!email) {
        return res.status(400).send('Email is required.');
    }

    // Prepare email message
    const msg = {
        to: email,
        from: 'rachittuteja@gmail.com', 
        subject: 'Welcome to DEV@Deakin!',
        text: 'Thank you for joining our platform!',
    };

    // Send email
    sgMail.send(msg)
        .then(() => {
            res.send('✅ Welcome email sent successfully!');
        })
        .catch(err => {
            console.error('SendGrid Error:', err.response ? err.response.body : err.message);
            res.status(500).send('Failed to send email. ' + err.message);
        });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});