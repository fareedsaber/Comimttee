const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorCode: { type: String, required: true },
  name: { type: String, required: true },
  nationalId: { type: String, required: true },
  specialty: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  appointmentHours: [
    {
      from: { type: String, required: true },  // e.g., "09:00"
      to: { type: String, required: true }     // e.g., "17:00"
    }
  ],
  
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);
