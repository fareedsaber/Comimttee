import React from 'react';
import Header from './Header';
import Sidebar from './Sidebare';

const SuperAdminDashboard = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <h1>SuperAdmin Dashboard</h1>
      <Sidebar />
    </div>
  );
};

export default SuperAdminDashboard;
