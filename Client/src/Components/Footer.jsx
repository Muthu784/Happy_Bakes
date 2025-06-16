import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-icons">
          <span><FaFacebook /></span>
          <span><FaInstagram /></span>
          <span><FaTwitter /></span>
          <span><FaWhatsapp/></span>
            <FaEnvelope />
        </div>
        <div className="text">
          <p>{new Date().getFullYear()} Happy Bakes. All Rights Received</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;