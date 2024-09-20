const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  fulName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  motherName: { type: String, required: true },
  gender: { type: String, required: true },
  religion: { type: String, required: true },
  nationality: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  nationalIdNumber: { type: String, required: true },
  passportNumber: { type: String, required: true,unique: true, },
  passportExpiryDate: { type: Date, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  stateOrProvince: { type: String, required: true },
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  hasDisability: { type: Boolean, default: false },
  disabilityType: { type: String },
  needsSpecialAssistance: { type: Boolean, default: false },
  assistanceType: { type: String },
  hasPreviousMedicalCondition: { type: Boolean, default: false },
  medicalConditions: { type: [String] },
  hasSurgeryInLastTwoYears: { type: Boolean, default: false },
  surgeryDetails: { type: String },
  passengerCode: { type: String, required: true },
  photo: { type: String },
  passportExpiryDate: {
    type: Date,
    required: false
},
passengerCode: {
    type: String,
    required: false
}

});

// Add a virtual field for fullName
clientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Ensure virtuals are included when converting documents to JSON
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
