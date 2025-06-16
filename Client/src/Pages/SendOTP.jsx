import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SendOTP.css';

const SendOTP = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setMessage(res.data.message);
      navigate('/verify-otp');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="send-otp-container">
      <h2>Send OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendOTP;