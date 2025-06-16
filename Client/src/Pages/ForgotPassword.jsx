import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { phone });
      setMessage(res.data.message);
      navigate('/verify-otp');
    } catch (err) {
      setMessage(err.response.data.error);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;