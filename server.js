import 'dotenv/config';   // Automatically loads environment variables from .env
import express from 'express';  // Use ES module syntax for express
import axios from 'axios';   // Use ES module syntax for axios
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package
import SibApiV3Sdk from 'sib-api-v3-sdk'; // Brevo SDK

const app = express();

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { name, email, message, subject } = req.body;

  // Set up Brevo API client
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  // Define the email data
  const sendSmtpEmail = {
    to: [{ email: 'blt.isabella.delphino@gmail.com', name: 'isabella' }],
    sender: { email: 'blt.isabella.delphino@gmail.com', name: 'blt.isabella.delphino@gmail.com' },
    subject: `New Contact from ${name}`,
    htmlContent: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Subject: ${subject}\</p><p>Message: ${message}</p>`,
  };

  try {
    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
