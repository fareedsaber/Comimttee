const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../module/User'); // Ensure this path is correct
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Authentication Middleware
const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store the user information in the request object
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Access denied. Invalid token.' });
  }
};

// Middleware for checking super admin status
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superAdmin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only superAdmin allowed.' });
  }
};

// Get user count and stats
router.get('/users/count', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const rate = 5; // Example static rate
    const levelUp = true;
    const levelDown = false;

    res.json({ totalUsers, rate, levelUp, levelDown });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user stats' });
  }
});

// POST: Create a new superAdmin
router.post('/createSuperAdmin', checkAuth,isSuperAdmin, async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user with the superAdmin role
    const superAdmin = new User({
      username,
      password,  // Plain text password
      role: 'superAdmin',
    });

    // Save the superAdmin to the database
    await superAdmin.save();

    res.status(201).json({ message: 'SuperAdmin created successfully' });
  } catch (error) {
    console.error('Error creating superAdmin:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (plain text comparison)
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, center: user.center },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with token, role, and center information
    return res.status(200).json({
      token,
      role: user.role,
      center: user.center
    });

  } catch (err) {
    console.error('Error during login:', err.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;
