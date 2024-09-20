import React, { useState } from 'react';

const CreateUserAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/createSuperAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('SuperAdmin created:', result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error creating SuperAdmin');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error creating SuperAdmin');
    }
  };
  

  return (
    <div>
      <h1>Create SuperAdmin</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create SuperAdmin</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CreateUserAdmin;
