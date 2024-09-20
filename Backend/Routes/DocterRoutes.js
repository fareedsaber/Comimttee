const express = require('express');
const router = express.Router();
const Doctor = require('../module/Docter'); // Ensure correct path to Doctor model
const Clinic = require('../module/Clinic'); // Ensure correct path to Clinic model

// Route to add a new doctor to a specific clinic
router.post('/add', async (req, res) => {
  try {
    const { doctorCode, name, nationalId, specialty, password, username, appointmentHours, clinicId } = req.body;

    // Check if the clinic exists
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Create and save the new doctor with the associated clinic
    const newDoctor = new Doctor({
      doctorCode,
      name,
      nationalId,
      specialty,
      password,
      username,
      appointmentHours, // Save appointment hours
      clinic: clinicId,  // Associate doctor with the clinic
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error("Error adding doctor:", error.message);
    res.status(500).json({ message: 'Error adding doctor', error: error.message });
  }
});

module.exports = router;
