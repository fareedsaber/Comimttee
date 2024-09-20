import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated?.(false); // Optional chaining to handle null or undefined
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutComponent;