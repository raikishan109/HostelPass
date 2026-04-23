const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Student Portal Local
  'http://localhost:5174', // Partner Portal Local
  'http://localhost:5175', // Admin Portal Local
  'https://hostelpass-90da9.web.app',
  'https://hostelpass-90da9.firebaseapp.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Hostel-Pass API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
