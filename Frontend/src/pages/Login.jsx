import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css"; // Ensure Tailwind is imported globally if required

const Login = ({ setIsAuthenticated, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('center', response.data.center);
        setIsAuthenticated(true);
        setRole(response.data.role);

        if (response.data.role === 'superAdmin') {
          navigate('/dashboard-superAdmin');
        } else {
          navigate('/dashboard-center');
        }
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error);
      setError('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };
  return (
    <section className="h-screen">
      <div className="container max-w-screen-lg mx-auto h-full px-6 py-24">
        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* Left column with image */}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone illustration"
            />
          </div>
  
          {/* Right column with login form */}
          <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
            <form onSubmit={handleLogin}>
              {/* Username input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  className="peer block w-full rounded border-0 bg-transparent px-3 py-[0.32rem] outline-none transition-all dark:text-white dark:placeholder:text-neutral-300"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 top-0 pt-[0.37rem] text-neutral-500 transition-all dark:text-neutral-400"
                >
                  Username
                </label>
              </div>
  
              {/* Password input */}
              <div className="relative mb-6">
                <input
                  type="password"
                  className="peer block w-full rounded border-0 bg-transparent px-3 py-[0.32rem] outline-none transition-all dark:text-white dark:placeholder:text-neutral-300"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-0 pt-[0.37rem] text-neutral-500 transition-all dark:text-neutral-400"
                >
                  Password
                </label>
              </div>
  
              {/* Remember me checkbox */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="inline-block">
                    Remember me
                  </label>
                </div>
          
              </div>
  
              {/* Submit button */}
              <button
                type="submit"
                className="inline-block w-full rounded bg-primary px-7 py-3 text-white font-medium text-sm leading-normal transition duration-150"
              >
                Sign in
              </button>
  
              {error && <p className="text-red-500 mt-2">{error}</p>}
  
              {/* Divider */}
             
            </form>
          </div>
        </div>
      </div>
    </section>
  );
  
};

export default Login;
