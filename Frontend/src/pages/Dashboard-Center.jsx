import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Saidbar from '../Components/SidbarCenter';

const CenterDashboard = ({ onLogout }) => {
  const [centerLogo, setCenterLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCenterLogo = async () => {
      try {
        // Fetch the center logo from the backend
        const response = await axios.get('http://localhost:5000/api/centers/center-logo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Assuming the backend returns { logo: 'url' }
        setCenterLogo(response.data.logo);
      } catch (err) {
        setError('Error fetching center logo.');
        console.error('Error fetching center logo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenterLogo();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Saidbar/>
      <h1>Center Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {centerLogo && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={centerLogo} 
            alt="Center Logo" 
            style={{ width: '150px', height: '150px', borderRadius: '8px' }} 
          />
        </div>
      )}
      <button 
        onClick={onLogout} 
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Logout
      </button>
    </div>
  );
};

export default CenterDashboard;
