import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUserToCenter = () => {
  const [centers, setCenters] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [role, setRole] = useState('centerUser'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No token found. Please login and try again');
      return;
    }

    const fetchCenters = async () => {
      try {
        const response = await axios.get(`${API_URL}/centers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCenters(response.data);
      } catch (error) {
        console.error('Error fetching centers:', error.message);
        setError('Error fetching centers. Please try again later.');
      }
    };

    fetchCenters();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic field validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!selectedCenter) {
      setError('Please select a center');
      return;
    }
    if (!token) {
      setError('No token found');
      return;
    }

    setLoading(true);

    try {
      const data = { username, password, role };
      const apiUrl = `${API_URL}/centers/${selectedCenter}/addUser`;

      await axios.post(apiUrl, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear form fields
      setUsername('');
      setPassword('');
      setSelectedCenter('');
      setRole('centerUser');
      navigate('/dashboard'); // Adjust route as needed
    } catch (error) {
      console.error('Error adding user:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Error adding user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
      <h2>Create and Add User to Center</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="center">Center</label>
          <select
            id="center"
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          >
            <option value="">Select a center</option>
            {centers.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          >
            <option value="centerAdmin">Center Admin</option>
            <option value="centerUser">Center User</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          style={{
            padding: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Create and Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUserToCenter;
