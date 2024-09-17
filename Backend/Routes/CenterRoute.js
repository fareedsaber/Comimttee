const express = require('express');
const router = express.Router();
const Center = require('../module/Center'); // Updated path to models
const User = require('../module/User'); // Updated path to models
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Middleware to check authentication
const checkAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust your JWT secret
    req.user = await User.findById(decoded.userId); // Adjust to find user by decoded userId
    if (!req.user) {
      return res.status(403).json({ error: 'User not found' });
    }
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
// Middleware to check if the user is superAdmin
const checkSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superAdmin') {
    return res.status(403).json({ error: 'Access denied. Only superAdmin allowed.' });
  }
  next();
};

// Middleware to check if user is centerAdmin or centerUser
const isCenterAdminOrUser = (req, res, next) => {
  const { centerId } = req.params;

  if (req.user && (req.user.role === 'centerAdmin' || req.user.role === 'centerUser')) {
    if (req.user.center && req.user.center.toString() === centerId) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Not authorized for this center.' });
    }
  } else {
    res.status(403).json({ error: 'Access denied. Admin or User only.' });
  }
};

// POST: Create a center
router.post('/', checkAuth, checkSuperAdmin, async (req, res) => {
  const { name, location, dateOfBuild, dateOfContract, logo } = req.body;

  if (!name || !location || !dateOfBuild || !dateOfContract) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const center = new Center({ name, location, dateOfBuild, dateOfContract, logo });
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    console.error('Error creating center:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: Update a center
router.put('/:centerId', checkAuth, checkSuperAdmin, async (req, res) => {
  const { centerId } = req.params;
  const { name, location, dateOfBuild, dateOfContract, logo } = req.body;

  try {
    const center = await Center.findById(centerId);

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    // Update center details
    center.name = name || center.name;
    center.location = location || center.location;
    center.dateOfBuild = dateOfBuild || center.dateOfBuild;
    center.dateOfContract = dateOfContract || center.dateOfContract;
    center.logo = logo || center.logo;

    await center.save();
    res.status(200).json(center);
  } catch (error) {
    console.error('Error updating center:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Delete a center
router.delete('/:centerId', checkAuth, checkSuperAdmin, async (req, res) => {
  const { centerId } = req.params;

  try {
    const center = await Center.findById(centerId);

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    await Center.findByIdAndDelete(centerId);
    await User.deleteMany({ center: centerId });

    res.status(200).json({ message: 'Center and associated users deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Add a user to a center
router.post('/:centerId/addUser', async (req, res) => {
  const { username, password, role } = req.body;
  const { centerId } = req.params;

  if (!username || !password || !role || !centerId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['centerAdmin', 'centerUser'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ username, password, role, center: centerId });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Retrieve users within a specific center
router.get('/:centerId/users', checkAuth, async (req, res) => {
  const { centerId } = req.params;

  try {
    const users = await User.find({ center: centerId }).populate('center', 'name');

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found for this center' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users in center:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Retrieve all centers
router.get('/', checkAuth, checkSuperAdmin, async (req, res) => {
  try {
    const centers = await Center.find();
    res.status(200).json(centers);
  } catch (error) {
    console.error('Error retrieving centers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/center-logo', checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('center', 'logo');
    if (!user || !user.center) {
      return res.status(400).json({ error: 'Center not found for this user' });
    }
    res.status(200).json({ logo: user.center.logo });
  } catch (error) {
    console.error('Error retrieving center logo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
