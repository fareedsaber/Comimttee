import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/SidbarSuber'; // Ensure this is the correct path

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
        setError('You are not authorized to view this content.');
        return;
      }
      try {
        const response = await axiosInstance.get('/centers');
        setCenters(response.data);
      } catch (error) {
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
      setError('Error deleting center');
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleCenterClick = (centerId) => {
    navigate(`/adduser/${centerId}`);
  };
  
  const handleCenterClickshow = (centerId) => {
    navigate(`/users/${centerId}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      
      {/* Main content section with added margin to create space */}
      <div className="container mx-auto p-4 ml-64"> {/* Add margin-left for space */}
        <h1 className="text-3xl font-semibold mb-6">Manage Centers</h1>

        {/* Create Center Form */}
        <form onSubmit={createCenter} className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold">Create Center</h2>

          <input
            type="text"
            placeholder="Center Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loadingCreate}
          />
          <input
            type="text"
            placeholder="Center Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loadingCreate}
          />
          <input
            type="date"
            placeholder="Date of Build"
            value={dateOfBuild}
            onChange={(e) => setDateOfBuild(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loadingCreate}
          />
          <input
            type="date"
            placeholder="Date of Contract"
            value={dateOfContract}
            onChange={(e) => setDateOfContract(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loadingCreate}
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={loadingCreate}
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg" disabled={loadingCreate}>
            {loadingCreate ? 'Adding...' : 'Add Center'}
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {/* Centers List */}
        <h2 className="text-2xl font-semibold mb-4">Centers List</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Date of Build</th>
              <th className="py-2 px-4">Date of Contract</th>
              <th className="py-2 px-4">Logo</th>
              <th className="py-2 px-4">Created By</th>
              <th className="py-2 px-4">Updated By</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td className="py-2 px-4">{center._id}</td>
                <td className="py-2 px-4">{center.name}</td>
                <td className="py-2 px-4">{center.location}</td>
                <td className="py-2 px-4">{new Date(center.dateOfBuild).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(center.dateOfContract).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <img src={center.logo} alt="Center Logo" className="w-12 h-12 object-cover" />
                </td>
                <td className="py-2 px-4">{center.createdBy?.username || 'N/A'}</td> {/* Displaying Created By */}
                <td className="py-2 px-4">{center.updatedBy?.username || 'N/A'}</td> {/* Displaying Updated By */}
                <td className="py-2 px-4">
                  <button
                    onClick={() => setSelectedCenterId(center._id)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded-lg mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteCenter(center._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-lg"
                    disabled={loadingDelete === center._id}
                  >
                    {loadingDelete === center._id ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => handleCenterClick(center._id)}
                    className="bg-green-500 text-white py-1 px-2 rounded-lg ml-2"
                  >
                    Add Users
                  </button>
                  <button
                    onClick={() => handleCenterClickshow(center._id)}
                    className="bg-blue-500 text-white py-1 px-2 rounded-lg ml-2"
                  >
                    Show Users
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Update Center Form */}
        {selectedCenterId && (
          <form onSubmit={updateCenter} className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Update Center</h2>

            <input
              type="text"
              placeholder="Center Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={loadingUpdate}
            />
            <input
              type="text"
              placeholder="Center Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={loadingUpdate}
            />
            <input
              type="date"
              placeholder="Date of Build"
              value={newDateOfBuild}
              onChange={(e) => setNewDateOfBuild(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={loadingUpdate}
            />
            <input
              type="date"
              placeholder="Date of Contract"
              value={newDateOfContract}
              onChange={(e) => setNewDateOfContract(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={loadingUpdate}
            />
            <input
              type="text"
              placeholder="Logo URL"
              value={newLogo}
              onChange={(e) => setNewLogo(e.target.value)}
              className="w-full p-2 border rounded-lg"
              disabled={loadingUpdate}
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg" disabled={loadingUpdate}>
              {loadingUpdate ? 'Updating...' : 'Update Center'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CenterManagement;
