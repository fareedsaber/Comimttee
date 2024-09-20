import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddDoctor.css"; // Importing the CSS file

const AddDoctor = () => {
  const [doctorDetails, setDoctorDetails] = useState({
    doctorCode: "",
    name: "",
    nationalId: "",
    specialty: "",
    password: "",
    username: "",
    appointmentHours: [], // Holds objects with 'from' and 'to' times
    clinicId: "",
  });
  const [clinics, setClinics] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clinics");
        setClinics(response.data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  // Function to handle changes in appointment hours
  const handleAppointmentHourChange = (index, type, value) => {
    const updatedHours = [...doctorDetails.appointmentHours];
    if (!updatedHours[index]) {
      updatedHours[index] = { from: "", to: "" }; // Initialize if not set
    }
    updatedHours[index][type] = value;
    setDoctorDetails({ ...doctorDetails, appointmentHours: updatedHours });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging - Log the state before submission
    console.log("Doctor details being submitted: ", doctorDetails);

    try {
      const response = await axios.post("http://localhost:5000/api/doctors/add", doctorDetails);
      setMessage(response.data.message);

      // Clear form after successful submission
      setDoctorDetails({
        doctorCode: "",
        name: "",
        nationalId: "",
        specialty: "",
        password: "",
        username: "",
        appointmentHours: [],
        clinicId: "",
      });
    } catch (error) {
      setMessage("Error adding doctor: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container">
      <h1>Add Doctor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Clinic</label>
          <select
            value={doctorDetails.clinicId}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, clinicId: e.target.value })}
            required
          >
            <option value="">Select a Clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic._id} value={clinic._id}>
                {clinic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Doctor Code</label>
          <input
            type="text"
            placeholder="Doctor Code"
            value={doctorDetails.doctorCode}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, doctorCode: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Doctor Name</label>
          <input
            type="text"
            placeholder="Doctor Name"
            value={doctorDetails.name}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>National ID</label>
          <input
            type="text"
            placeholder="National ID"
            value={doctorDetails.nationalId}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, nationalId: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Specialty</label>
          <input
            type="text"
            placeholder="Specialty"
            value={doctorDetails.specialty}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, specialty: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={doctorDetails.password}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={doctorDetails.username}
            onChange={(e) => setDoctorDetails({ ...doctorDetails, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Appointment Hours</label>
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <label>Hour Range {index + 1}</label>
              <div>
                <label>From:</label>
                <input
                  type="time"
                  value={doctorDetails.appointmentHours[index]?.from || ""}
                  onChange={(e) => handleAppointmentHourChange(index, "from", e.target.value)}
                />
                <label>To:</label>
                <input
                  type="time"
                  value={doctorDetails.appointmentHours[index]?.to || ""}
                  onChange={(e) => handleAppointmentHourChange(index, "to", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit">Add Doctor</button>
      </form>

      {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default AddDoctor;
