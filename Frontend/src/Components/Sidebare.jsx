import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Saidbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/center">Cneter</Link>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Saidbar;
