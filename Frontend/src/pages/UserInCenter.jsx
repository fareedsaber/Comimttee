import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersInCenter.css';

const UsersInCenter = ({ centerId }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!centerId) return; // Avoid fetching if centerId is not provided

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in sessionStorage
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/centers/${centerId}/users`, {
          headers: {
            Authorization: `Bearer ${token}` // Add the token to the Authorization header
          }
        });
        
        setUsers(response.data);
        setError(''); // Clear any previous error
      } catch (error) {
        setError(error.response?.data?.error || 'Error fetching users');
      }
    };

    fetchUsers();
  }, [centerId]);

  return (
    <div className="users-container">
      <h2>Users in Center</h2>
      {error && <p className="error">{error}</p>}
      {users.length === 0 ? (
        <p>No users found in this center</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Center</th>
              <th>Joined At</th>
              <th>Created By</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.center?.name || 'No Center'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{user.createdBy?.username || 'Unknown'}</td> {/* Display createdBy username */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersInCenter;
