import React, { useState } from "react";
import axios from "axios";

const AddClinic = () => {
  const [clinicName, setClinicName] = useState("");
  const [message, setMessage] = useState("");

  // Assume centerId is stored in session storage
  const centerId = localStorage.getItem("center");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centerId) {
      setMessage("Center ID not found. Please log in as a center admin.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/clinic/add", {
        name: clinicName,
        centerId: centerId, // Add the centerId to the request payload
      });
      setMessage(response.data.message);
      setClinicName(""); // Clear input after submission
    } catch (error) {
      setMessage("Error adding clinic: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h1>Add Clinic</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Clinic Name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          required
        />
        <button type="submit">Add Clinic</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddClinic;
