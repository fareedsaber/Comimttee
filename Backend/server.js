const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();
// Importing routes (Ensure these files export valid routers)
const ClientRoutes = require('./Routes/ClientRoutes');
const authRoutes = require('./Routes/authRoutes');
const centerRoutes = require('./Routes/CenterRoute');
const ClinicRoutes = require('./Routes/ClinicRoutes'); // Renamed to ClinicRoutes for consistency
const DoctorRoutes = require('./Routes/DocterRoutes'); // Corrected spelling to "DoctorRoutes"

// Initialize Express app
const app = express();

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/new';
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Security headers
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/centers', centerRoutes); // Center routes
app.use('/api/clients', ClientRoutes); // Client routes
app.use('/api/clinics', ClinicRoutes); // Clinic routes (fixed endpoint naming to plural form)
app.use('/api/doctors', DoctorRoutes); // Doctor routes (corrected spelling)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});
