import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import CenterManagement from './pages/Center.jsx';
import AddUserToCenter from './pages/AddUserCenter.jsx';
import UsersInCenter from './pages/UserInCenter.jsx';
import CreateSuperAdmin from './pages/CreateUserAdmin.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import CenterDashboard from './pages/Dashboard-Center.jsx';
import Login from './pages/Login.jsx';
import ClientManagement from './pages/Client.jsx';
import AddClinic from './pages/Clinic.jsx';
import AddDoctor from './pages/Docter.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('center');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              role === 'superAdmin' ? (
                <Navigate to="/dashboard-superAdmin" />
              ) : (
                <Navigate to="/dashboard-center" />
              )
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
            )
          }
        />
        <Route
          path="/center"
          element={
            isAuthenticated && role === 'superAdmin' ? (
              <CenterManagement onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/adduser/:centerId"
          element={
            isAuthenticated && role === 'superAdmin' ? (
              <AddUserToCenterWrapper />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/users/:centerId"
          element={
            isAuthenticated && role === 'superAdmin' ? (
              <UsersInCenterWrapper />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard-superAdmin"
          element={
            isAuthenticated && role === 'superAdmin' ? (
              <SuperAdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard-center"
          element={
            isAuthenticated && ['centerAdmin', 'centerUser'].includes(role) ? (
              <CenterDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/form"
          element={
            isAuthenticated && ['centerAdmin', 'centerUser'].includes(role) ? (
              <ClientManagement onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
          <Route
          path="/addclinic"
          element={
            isAuthenticated && ['centerAdmin', 'centerUser'].includes(role) ? (
              <AddClinic onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route
          path="/adddocter"
          element={
            isAuthenticated && ['centerAdmin', 'centerUser'].includes(role) ? (
              <AddDoctor onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/create" element={<CreateSuperAdmin />} />
      </Routes>
    </Router>
  );
};

// Wrappers to pass centerId as a prop
const AddUserToCenterWrapper = () => {
  const { centerId } = useParams();
  return <AddUserToCenter centerId={centerId} />;
};

const UsersInCenterWrapper = () => {
  const { centerId } = useParams();
  return <UsersInCenter centerId={centerId} />;
};

export default App;
