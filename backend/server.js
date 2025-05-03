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
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const vcfContent = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName}\nFN:${firstName} ${lastName}\nEMAIL:${email}\nTEL:${phone}\nEND:VCARD`;
  const filename = `${firstName}-${lastName}.vcf`;
  const filePath = `./contacts/${filename}`;

  // Ensure directory exists
  if (!fs.existsSync('./contacts')) {
    fs.mkdirSync('./contacts');
  }

  fs.writeFileSync(filePath, vcfContent);

  const smsBody = `Here is the contact information to ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}`;

  try {
    await client.messages.create({
      to: '+12508640030',
      from: messagingServiceSid,
      body: smsBody
    });

    res.status(200).json({ message: 'Contact sent via SMS successfully.' });
  } catch (err) {
    console.error('SMS failed:', err);
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
