import React, { useState } from 'react';
import emailjs from 'emailjs-com';


const EmailVerification = ({ username, userEmail, verificationUrl }) => {
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const sendVerificationEmail = (e) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage('Sending email...');

    // Your Email.js user ID, service ID, and template ID
    const serviceID = Process.env.serviceID;
    const templateID = Process.env.templateID;
    const userID = Process.env.userID;

    const templateParams = {
      to_name: username,
      to_email: userEmail,
      verification_url: verificationUrl,
      message: `Welcome, ${username}. Please verify your email by clicking the link below.`,
    };

    // Send the email via Email.js
    emailjs
      .send(serviceID, templateID, templateParams, userID)
      .then(
        (result) => {
          setSending(false);
          setStatusMessage('Verification email sent successfully!');
        },
        (error) => {
          setSending(false);
          setStatusMessage('Failed to send the email. Please try again.');
          console.error(error);
        }
      );
  };

  return (
    <div>
      <h1>Send Verification Email</h1>
      <form onSubmit={sendVerificationEmail}>
        <p>Welcome, {username}!</p>
        <p>We will send a verification email to {userEmail}.</p>
        <button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send Verification Email'}
        </button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default EmailVerification;
