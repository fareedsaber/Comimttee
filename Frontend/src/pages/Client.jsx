import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './ClientManagement.css'; // Ensure the path is correct
import { states, cities, nationalities } from './stateCityData'; // Assuming these are correctly exported

const Client = () => {
    const [clientForm, setClientForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        fulName: '', // Make sure this is initialized
        dateOfBirth: '',
        motherName: '',
        gender: '',
        religion: '',
        nationality: '',
        maritalStatus: '',
        nationalIdNumber: '',
        passportNumber: '',
        passportExpiryDate: '',
        address: '',
        city: '',
        stateOrProvince: '',
        postalCode: '',
        phoneNumber: '',
        email: '',
        hasDisability: false,
        disabilityType: '',
        needsSpecialAssistance: false,
        assistanceType: '',
        hasPreviousMedicalCondition: false,
        medicalConditions: [],
        hasSurgeryInLastTwoYears: false,
        surgeryDetails: '',
        passengerCode: '',
        photo: '',
      });
      
      
  
  const [photo, setPhoto] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate max and min dates for Date of Birth
  const currentDate = new Date().toISOString().split('T')[0]; // Max Date: Today
  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100))
    .toISOString()
    .split('T')[0]; // Min Date: 100 years ago

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm({
      ...clientForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle state change to update available cities
  const handleStateChange = (selectedOption) => {
    const state = selectedOption ? selectedOption.value : '';
    setClientForm({ ...clientForm, stateOrProvince: state, city: '' });
    setAvailableCities(cities[state] || []);
  };

  // Handle city change
  const handleCityChange = (selectedOption) => {
    setClientForm({ ...clientForm, city: selectedOption ? selectedOption.value : '' });
  };
  
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Store the uploaded file
  };

  // Handle medical condition selection
  const handleMedicalConditionChange = (condition) => {
    setClientForm((prevState) => {
      const medicalConditions = prevState.medicalConditions.includes(condition)
        ? prevState.medicalConditions.filter((item) => item !== condition)
        : [...prevState.medicalConditions, condition];
      return { ...prevState, medicalConditions };
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Append all clientForm data to FormData
    for (const key in clientForm) {
      formData.append(key, clientForm[key]);
    }
  
    // Append the photo if it's selected
    if (photo) {
      formData.append('photo', photo);
    }
  
    try {
      await axios.post('http://localhost:5000/api/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Client added successfully!');
      // Reset form
      setClientForm({
        firstName: '',
        middleName: '',
        lastName: '',
        fullName: '', // Resetting the field
        dateOfBirth: '',
        motherName: '',
        gender: '',
        religion: '',
        nationality: '',
        maritalStatus: '',
        nationalIdNumber: '',
        passportNumber: '',
        passportExpiryDate: '',
        address: '',
        city: '',
        stateOrProvince: '',
        postalCode: '',
        phoneNumber: '',
        email: '',
        hasDisability: false,
        disabilityType: '',
        needsSpecialAssistance: false,
        assistanceType: '',
        hasPreviousMedicalCondition: false,
        medicalConditions: [],
        hasSurgeryInLastTwoYears: false,
        surgeryDetails: '',
        passengerCode: '',
        photo: '',
      });
      setPhoto(null);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error saving client. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex">
      <div className="container mx-auto px-4 py-8 bg-gray-100 flex-grow">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Registration Form</h1>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={clientForm.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={clientForm.middleName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={clientForm.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Full Name</label>
              <input
  type="text"
  name="fulName"
  value={clientForm.fulName || ''} // Ensure it never goes undefined
  onChange={handleChange}
  className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
  required
/>

            </div>
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={clientForm.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
                max={currentDate}
                min={minDate}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={clientForm.motherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Gender</label>
              <select
                name="gender"
                value={clientForm.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Nationality, Religion, and Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Nationality</label>
              <Select
                options={nationalities}
                value={nationalities.find(option => option.value === clientForm.nationality)}
                onChange={selectedOption => setClientForm({ ...clientForm, nationality: selectedOption.value })}
                className="basic-single"
                classNamePrefix="select"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Religion</label>
              <input
                type="text"
                name="religion"
                value={clientForm.religion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Marital Status</label>
              <select
                name="maritalStatus"
                value={clientForm.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* Identification Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">National ID Number</label>
              <input
                type="text"
                name="nationalIdNumber"
                value={clientForm.nationalIdNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                value={clientForm.passportNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Passport Expiry Date</label>
              <input
                type="date"
                name="passportExpiryDate"
                value={clientForm.passportExpiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={clientForm.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <Select
                options={availableCities}
                value={availableCities.find(option => option.value === clientForm.city)}
                onChange={handleCityChange}
                className="basic-single"
                classNamePrefix="select"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">State/Province</label>
              <Select
                options={states}
                value={states.find(option => option.value === clientForm.stateOrProvince)}
                onChange={handleStateChange}
                className="basic-single"
                classNamePrefix="select"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={clientForm.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={clientForm.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={clientForm.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Disability Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Has Disability?</label>
              <input
                type="checkbox"
                name="hasDisability"
                checked={clientForm.hasDisability}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Disability Type</label>
              <input
                type="text"
                name="disabilityType"
                value={clientForm.disabilityType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!clientForm.hasDisability} // Disable if no disability
              />
            </div>
          </div>

          {/* Special Assistance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Needs Special Assistance?</label>
              <input
                type="checkbox"
                name="needsSpecialAssistance"
                checked={clientForm.needsSpecialAssistance}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Assistance Type</label>
              <input
                type="text"
                name="assistanceType"
                value={clientForm.assistanceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!clientForm.needsSpecialAssistance} // Disable if no assistance needed
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Has Previous Medical Condition?</label>
              <input
                type="checkbox"
                name="hasPreviousMedicalCondition"
                checked={clientForm.hasPreviousMedicalCondition}
                onChange={handleChange}
                className="mr-2"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Medical Conditions</label>
              <div>
                {['Diabetes', 'Heart Disease', 'Asthma', 'None'].map(condition => (
                  <div key={condition}>
                    <input
                      type="checkbox"
                      checked={clientForm.medicalConditions.includes(condition)}
                      onChange={() => handleMedicalConditionChange(condition)}
                      className="mr-2"
                    />
                    <label>{condition}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Client;
