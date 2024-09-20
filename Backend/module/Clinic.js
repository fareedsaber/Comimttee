const mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    center: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Center', // Reference to the Center model
        required: true
    }
});

const Clinic = mongoose.model('Clinic', ClinicSchema);

module.exports = Clinic;
