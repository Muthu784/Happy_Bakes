import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Happy Bakes</h3>
          <p>Delivering happiness through delicious baked goods since 2024. We specialize in custom cakes, pastries, and artisanal bread.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
            <a href="mailto:contact@happybakes.com"><FaEnvelope /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#menu">Our Menu</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#order">Order Online</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li><FaMapMarkerAlt /> 123 Bakery Street, City, Country</li>
            <li><FaPhone /> +1 234 567 8900</li>
            <li><FaEnvelope /> contact@happybakes.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Opening Hours</h3>
          <ul className="hours">
            <li>Monday - Friday: 8:00 AM - 8:00 PM</li>
            <li>Saturday: 9:00 AM - 7:00 PM</li>
            <li>Sunday: 10:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Happy Bakes. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;