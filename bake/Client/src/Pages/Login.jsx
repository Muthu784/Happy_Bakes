import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../Styles/Login.css';

const LoginComponent = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  // Clear form and optionally localStorage on mount
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (res.data.message === 'Logged in successfully') {
        const userData = {
          name: res.data.user.name,
          email: res.data.user.email,
          isAdmin: res.data.user.isAdmin,
          role: res.data.user.role
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', res.data.token);
        login(userData);

        // Navigate based on user role
        if (userData.isAdmin) {
          navigate('/Admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off" name="loginForm">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default LoginComponent;
