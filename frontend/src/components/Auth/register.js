import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock,FaHome } from 'react-icons/fa'; // Assuming you want the lock icon

import './Auth.css'; // Make sure you have the CSS file imported

const API_URL = 'http://127.0.0.1:5000';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and Password must be provided');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, isAdmin: isAdmin ? 1 : 0, email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Parsed response data:', data);
        localStorage.setItem('user', data.user.is_admin);
        const { user, access_token } = data;

        if (access_token) {
          localStorage.setItem('accessToken', access_token);
        } else {
          console.error('Access token is missing in the response.');
          setError('Access token missing. Try again.');
          return;
        }

        if (user && user.is_admin !== undefined) {
          console.log('user.is_admin:', user.is_admin);
          if (parseInt(user.is_admin, 10) === 1) {
            console.log('Navigating to admin dashboard');
            navigate('/admin-dashboard');
          } else {
            console.log('Navigating to user dashboard');
            navigate('/user-dashboard');
          }
        } else {
          setError('User data is missing or incomplete.');
        }
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setError('Sign up failed. Please try again.');
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div className="auth-container">
       <button className="home-icon" onClick={() => navigate('/')}>
        <FaHome />
      </button>
      <div className="auth-box">
        <div className="auth-image" />
        <div className="auth-form">
          <div className="avatar">
            <FaLock />
          </div>
          <h1>Sign Up</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Admin
            </label>
            <button type="submit">Sign Up</button>
            <div className="links">
              <Link to="/sign-in">Already registered? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;