import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make HTTP requests
import Header from './Header';
import Sidebar from '../Components/SidbarSuber';
import CardDataStats from '../Components/CardDataStats';
import ChartOne from '../Components/Charts/ChartOne';
import ChartTwo from '../Components/Charts/ChartTwo';
import ChartThree from '../Components/Charts/ChartThree';
import "../App.css";

const SuperAdminDashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const [userStats, setUserStats] = useState({ total: 0 });
  const [centerStats, setCenterStats] = useState({ total: 0 });

  // Fetch user and center statistics from the backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3000/api/count'); // Replace with the correct endpoint
        const centersResponse = await axios.get('http://localhost:3000/api/centers/count'); // Replace with the correct endpoint
        
        setUserStats({
          total: usersResponse.data.totalUsers,
          rate: usersResponse.data.rate, // Optional: growth rate or any stat you want to display
          levelUp: usersResponse.data.levelUp, // true or false to determine if it's increasing
          levelDown: usersResponse.data.levelDown, // true or false to determine if it's decreasing
        });

        setCenterStats({
          total: centersResponse.data.totalCenters,
          rate: centersResponse.data.rate, // Optional: growth rate or any stat you want to display
          levelUp: centersResponse.data.levelUp, // true or false to determine if it's increasing
          levelDown: centersResponse.data.levelDown, // true or false to determine if it's decreasing
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Header />
      <Sidebar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Card for User Stats */}
        <CardDataStats
          title="Total Users"
          total={userStats.total}
          rate={userStats.rate}
          levelUp={userStats.levelUp}
          levelDown={userStats.levelDown}
        >
          {/* Icon or content to represent Users */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M5 3h14M7 21h10M12 3v18M7 21V9m0-6h0M17 21V9m0-6h0" />
          </svg>
        </CardDataStats>

        {/* Card for Center Stats */}
        <CardDataStats
          title="Total Centers"
          total={centerStats.total}
          rate={centerStats.rate}
          levelUp={centerStats.levelUp}
          levelDown={centerStats.levelDown}
        >
          {/* Icon or content to represent Centers */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18m0 0l6-6m-6 6L6 15m0 0V9m0 6h12"
            />
          </svg>
        </CardDataStats>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default SuperAdminDashboard;
