import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get email from localStorage (set after signup)
  const email = localStorage.getItem('pendingEmail') || '';

  // Only show if email exists (i.e. after signup)
  if (!email) {
    return (
      <div className="otp-verification-container">
        <h2>No signup in progress</h2>
        <p>Please sign up to verify your email.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8000/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok && (data.success || data.message === 'Email verified')) {
        setSuccess('Email verified successfully!');
        localStorage.setItem('emailVerified', 'true');
        localStorage.removeItem('pendingEmail');
        setTimeout(() => navigate('/login'), 0);
      } else {
        setError(data.error || data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="otp-verification-container">
      <h2>Email not verified</h2>
      <p>Please verify OTP sent to your email: <b>{email}</b></p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default OTPVerificationPage;
