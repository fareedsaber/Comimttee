const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Optional, for security headers
const authRoutes = require('./Routes/authRoutes'); // Adjust paths if necessary
const centerRoutes = require('./Routes/CenterRoute'); // Adjust paths if necessary
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/new', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// CORS configuration
app.use(cors());

// Security headers (optional, but recommended)
app.use(helmet());

// Middleware
app.use(express.json()); // Use express.json() for parsing application/json

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api/centers', centerRoutes); // Center routes

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
