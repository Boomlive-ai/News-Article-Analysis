const express = require("express");
require("dotenv").config();
const cors = require('cors');
const { sendContactEmail } = require("./api/services/emailService");
const { summarizeNews, extractSentimentFromNews } = require("./api/services/summarizeNews"); // Import the summarizeNews function
const fileUpload = require('express-fileupload');
const app = express();

// Define allowed origins, including localhost on any port
const allowedOrigins = ['https://analyzesentiment.vercel.app','https://news-article-summarizer.vercel.app','https://nas-lovat.vercel.app','https://www.axionmatrix.com','https://axionmatrix.vercel.app','https://ims-api-beige.vercel.app', /^http:\/\/localhost:\d+$/];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some((allowedOrigin) => allowedOrigin instanceof RegExp ? allowedOrigin.test(origin) : allowedOrigin === origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // Add any other headers if needed
};

// Use CORS with options and handle preflight requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware to handle file uploads
app.use(fileUpload({ useTempFiles: true }));

// Express JSON and URL-encoded data middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Contact form route, calling the email service
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, description } = req.body; // Destructure all form fields

  try {
    await sendContactEmail({ name, email, phone, description });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Summarize news route
app.post("/api/summarize", summarizeNews); // Add the summarizeNews route
app.post("/api/sentiment", extractSentimentFromNews );



// A fallback route to handle any other GET requests
app.get('*', (req, res) => {
  res.status(200).json({ message: 'Hello' });
});

module.exports = app;
