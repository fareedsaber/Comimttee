import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebare'; // Ensure this is the correct path

const CenterManagement = () => {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dateOfBuild, setDateOfBuild] = useState('');
  const [dateOfContract, setDateOfContract] = useState('');
  const [logo, setLogo] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDateOfBuild, setNewDateOfBuild] = useState('');
  const [newDateOfContract, setNewDateOfContract] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const axiosInstance = useMemo(() => axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  useEffect(() => {
    const fetchCenters = async () => {
      if (!token) {
        console.warn('No token found, cannot fetch centers.');
        setError('You are not authorized to view this content.');
        return;
      }
      try {
        const response = await axiosInstance.get('/centers');
        setCenters(response.data);
      } catch (error) {
        console.error('Error fetching centers:', error.response?.data || error.message);
        setError('Error fetching centers or unauthorized access.');
      }
    };

    fetchCenters();
  }, [axiosInstance, token]);

  const createCenter = async (e) => {
    e.preventDefault();
    if (!name || !location || !dateOfBuild || !dateOfContract) {
      setError('All fields are required');
      return;
    }

    setError('');
    setLoadingCreate(true);

    try {
      const response = await axiosInstance.post('/centers', { 
        name, 
        location, 
        dateOfBuild, 
        dateOfContract, 
        logo 
      });
      setCenters((prevCenters) => [...prevCenters, response.data]);
      setName('');
      setLocation('');
      setDateOfBuild('');
      setDateOfContract('');
      setLogo('');
    } catch (error) {
      console.error('Error creating center:', error.response?.data || error.message);
      setError('Error creating center');
    } finally {
      setLoadingCreate(false);
    }
  };

  const updateCenter = async (e) => {
    e.preventDefault();
    if (!newName || !newLocation || !newDateOfBuild || !newDateOfContract) {
      setError('All fields are required');
      return;
    }

    setError('');
    setLoadingUpdate(true);

    try {
      const response = await axiosInstance.put(`/centers/${selectedCenterId}`, {
        name: newName,
        location: newLocation,
        dateOfBuild: newDateOfBuild,
        dateOfContract: newDateOfContract,
        logo: newLogo,
      });

      setCenters((prevCenters) =>
        prevCenters.map((center) =>
          center._id === selectedCenterId ? response.data : center
        )
      );
      setSelectedCenterId(null);
      setNewName('');
      setNewLocation('');
      setNewDateOfBuild('');
      setNewDateOfContract('');
      setNewLogo('');
    } catch (error) {
      console.error('Error updating center:', error.response?.data || error.message);
      setError('Error updating center');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const deleteCenter = async (centerId) => {
    setError('');
    setLoadingDelete(centerId);

    try {
      await axiosInstance.delete(`/centers/${centerId}`);
      setCenters((prevCenters) => prevCenters.filter((center) => center._id !== centerId));
    } catch (error) {
      console.error('Error deleting center:', error.response?.data || error.message);
      setError('Error deleting center');
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleCenterClick = (centerId) => {
    navigate(`/adduser/${centerId}`);
  };

  return (
    <div>
      <h1>Manage Centers</h1>

      {/* Form for creating a new center */}
      <form onSubmit={createCenter}>
        <h2>Create Center</h2>
        <input
          type="text"
          placeholder="Center Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loadingCreate}
        />
        <input
          type="text"
          placeholder="Center Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loadingCreate}
        />
        <input
          type="date"
          placeholder="Date of Build"
          value={dateOfBuild}
          onChange={(e) => setDateOfBuild(e.target.value)}
          disabled={loadingCreate}
        />
        <input
          type="date"
          placeholder="Date of Contract"
          value={dateOfContract}
          onChange={(e) => setDateOfContract(e.target.value)}
          disabled={loadingCreate}
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          disabled={loadingCreate}
        />
        <button type="submit" disabled={loadingCreate}>
          {loadingCreate ? 'Adding...' : 'Add Center'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table of centers */}
      <h2>Centers List</h2>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Date of Build</th>
            <th>Date of Contract</th>
            <th>Logo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {centers.map((center) => (
            <tr key={center._id}>
              <td>{center._id}</td>
              <td>{center.name}</td>
              <td>{center.location}</td>
              <td>{new Date(center.dateOfBuild).toLocaleDateString()}</td>
              <td>{new Date(center.dateOfContract).toLocaleDateString()}</td>
              <td>
                {center.logo && <img src={center.logo} alt="Center Logo" style={{ width: '50px', height: '50px' }} />}
              </td>
              <td>
                <button
                  onClick={() => deleteCenter(center._id)}
                  disabled={loadingDelete === center._id}
                >
                  {loadingDelete === center._id ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCenterId(center._id);
                    setNewName(center.name);
                    setNewLocation(center.location);
                    setNewDateOfBuild(center.dateOfBuild.split('T')[0]);
                    setNewDateOfContract(center.dateOfContract.split('T')[0]);
                    setNewLogo(center.logo);
                  }}
                  disabled={loadingUpdate}
                >
                  Update
                </button>
                <button onClick={() => handleCenterClick(center._id)}>Add Users</button>
                <button onClick={() => navigate(`/users/${center._id}`)}>View Users</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form for updating a center */}
      {selectedCenterId && (
        <form onSubmit={updateCenter}>
          <h2>Update Center</h2>
          <input
            type="text"
            placeholder="New Center Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loadingUpdate}
          />
          <input
            type="text"
            placeholder="New Center Location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            disabled={loadingUpdate}
          />
          <input
            type="date"
            placeholder="New Date of Build"
            value={newDateOfBuild}
            onChange={(e) => setNewDateOfBuild(e.target.value)}
            disabled={loadingUpdate}
          />
          <input
            type="date"
            placeholder="New Date of Contract"
            value={newDateOfContract}
            onChange={(e) => setNewDateOfContract(e.target.value)}
            disabled={loadingUpdate}
          />
          <input
            type="text"
            placeholder="New Logo URL"
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
            disabled={loadingUpdate}
          />
          <button type="submit" disabled={loadingUpdate}>
            {loadingUpdate ? 'Updating...' : 'Update Center'}
          </button>
          <button type="button" onClick={() => setSelectedCenterId(null)} disabled={loadingUpdate}>
            Cancel
          </button>
        </form>
      )}

      <Sidebar />
    </div>
  );
};

export default CenterManagement;
