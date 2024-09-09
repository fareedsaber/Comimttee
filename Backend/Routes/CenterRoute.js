const express = require('express');
const router = express.Router();
const Center = require('../models/Center'); 
module.exports = router;
const User=require("../module/User")

router.post('/center', async (req, res) => {
  const { name, location } = req.body;

  try {
    const center = new Center({ name, location });
    await center.save();
    res.status(201).json(center);
  } catch (err) {
    res.status(400).json({ error: 'Error creating center' });
  }
});




router.post('/center/:centerId/user', async (req, res) => {
  const { name, email, password } = req.body;
  const { centerId } = req.params;

  try {
    const user = new User({ name, email, password, center: centerId });
    await user.save();

    const center = await Center.findById(centerId);
    center.user.push(user._id);
    await center.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error creating user' });
  }
});
