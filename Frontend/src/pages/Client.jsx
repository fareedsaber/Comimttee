import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './ClientManagement.css';
import { states, cities, nationalities } from './stateCityData';

const Client = () => {
  const [clientForm, setClientForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '', // Ensure this is initialized
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

  const currentDate = new Date().toISOString().split('T')[0];
  const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100))
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    setClientForm((prev) => ({
      ...prev,
      fullName: `${prev.firstName} ${prev.middleName} ${prev.lastName}`.trim(),
    }));
  }, [clientForm.firstName, clientForm.middleName, clientForm.lastName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientForm({
      ...clientForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleStateChange = (selectedOption) => {
    const state = selectedOption ? selectedOption.value : '';
    setClientForm({ ...clientForm, stateOrProvince: state, city: '' });
    setAvailableCities(cities[state] || []);
  };

  const handleCityChange = (selectedOption) => {
    setClientForm({ ...clientForm, city: selectedOption ? selectedOption.value : '' });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleMedicalConditionChange = (condition) => {
    setClientForm((prevState) => {
      const medicalConditions = prevState.medicalConditions.includes(condition)
        ? prevState.medicalConditions.filter((item) => item !== condition)
        : [...prevState.medicalConditions, condition];
      return { ...prevState, medicalConditions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in clientForm) {
      formData.append(key, clientForm[key]);
    }

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
      setClientForm({
        firstName: '',
        middleName: '',
        lastName: '',
        fullName: '',
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
            {/* First Name */}
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
            {/* Middle Name */}
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
            {/* Last Name */}
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
            {/* Full Name */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={clientForm.fullName || ''}
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Nationality */}
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Nationality</label>
              <Select
                options={nationalities.map(nat => ({ value: nat, label: nat }))}
                onChange={(option) => setClientForm({ ...clientForm, nationality: option.value })}
                className="basic-single"
                classNamePrefix="select"
                isClearable
                placeholder="Select Nationality"
              />
            </div>
            {/* Marital Status */}
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
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* National ID and Passport */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">National ID Number</label>
              <input
                type="text"
                name="nationalIdNumber"
                value={clientForm.nationalIdNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
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
                required
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

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={clientForm.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">City</label>
              <Select
                options={availableCities.map(city => ({ value: city, label: city }))}
                onChange={handleCityChange}
                className="basic-single"
                classNamePrefix="select"
                isClearable
                placeholder="Select City"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">State / Province</label>
              <Select
                options={states.map(state => ({ value: state, label: state }))}
                onChange={handleStateChange}
                className="basic-single"
                classNamePrefix="select"
                isClearable
                placeholder="Select State"
              />
            </div>
          </div>

          {/* Postal Code and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={clientForm.postalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
              <input
                type="text"
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

          {/* Disability and Medical Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Has Disability</label>
              <input
                type="checkbox"
                name="hasDisability"
                checked={clientForm.hasDisability}
                onChange={handleChange}
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
                disabled={!clientForm.hasDisability}
              />
            </div>
          </div>

          {/* Special Assistance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Needs Special Assistance</label>
              <input
                type="checkbox"
                name="needsSpecialAssistance"
                checked={clientForm.needsSpecialAssistance}
                onChange={handleChange}
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
                disabled={!clientForm.needsSpecialAssistance}
              />
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Has Previous Medical Condition</label>
              <input
                type="checkbox"
                name="hasPreviousMedicalCondition"
                checked={clientForm.hasPreviousMedicalCondition}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Medical Conditions</label>
              <input
                type="text"
                name="medicalConditions"
                value={clientForm.medicalConditions.join(', ')} // Join for display purposes
                onChange={(e) => handleMedicalConditionChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!clientForm.hasPreviousMedicalCondition}
              />
            </div>
          </div>

          {/* Surgery Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Surgery in Last 5 Years</label>
              <input
                type="checkbox"
                name="hadSurgeryLast5Years"
                checked={clientForm.hadSurgeryLast5Years}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Surgery Details</label>
              <input
                type="text"
                name="surgeryDetails"
                value={clientForm.surgeryDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!clientForm.hadSurgeryLast5Years}
              />
            </div>
          </div>

          {/* Consent */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Consent</label>
              <input
                type="checkbox"
                name="consent"
                checked={clientForm.consent}
                onChange={handleChange}
                required
              />
              <span className="text-gray-600 ml-2">I consent to the terms and conditions.</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Client;
