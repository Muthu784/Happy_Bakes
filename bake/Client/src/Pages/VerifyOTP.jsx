import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: localStorage.getItem('email'),
        otp,
      });
      setMessage(res.data.message);
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="sumbit">Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOTP;