const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Route
app.post('/api/exchange-contact', async (req, res) => {
  const { firstName, lastName, email, phone, sender } = req.body;

  if (!firstName || !lastName || !email || !phone || !sender) {
    return res.status(400).json({ error: 'All fields including sender are required.' });
  }

  const smsBody = `\n\nYour contact has been saved by ${firstName} ${lastName}.\n\nHere is their contact info:\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}`;

  let destinationNumber;
  console.log('Received sender:', sender);
  switch (sender.toLowerCase()) {
    case 'colton':
      destinationNumber = '+61468372453';
      break;
    case 'hailey':
      destinationNumber = '+61403886675';
      break;
    default:
      return res.status(400).json({ error: 'Invalid sender.' });
  }

  try {
    await client.messages.create({
      to: destinationNumber,
      from: messagingServiceSid,
      body: smsBody
    });

    res.status(200).json({ message: 'Contact sent via SMS successfully.' });
  } catch (err) {
    console.error('SMS failed:', err.message, err.code, err);
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
