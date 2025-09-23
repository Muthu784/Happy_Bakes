import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import emailjs from '@emailjs/browser';
import '../Styles/register.css'


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if it's admin registration using environment variables
      const isAdmin = email === process.env.REACT_APP_ADMIN_EMAIL && 
                     name === process.env.REACT_APP_ADMIN_NAME && 
                     phone === process.env.REACT_APP_ADMIN_PHONE &&
                     password === process.env.REACT_APP_ADMIN_PASSWORD;
      
      // Save user data to the backend
        axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        phone,
        isAdmin: isAdmin
      });

      setMessage('Registration successful!');
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred during registration.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;