import React from 'react';
import './footer.css';

// Import icons
import { FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <div className="footer-social">
          <span>Follow us: </span>
          <FaInstagram />
          <FaTwitter />
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Petal Perfect
        </div>
      </div>
    </footer>
  );
};

export default Footer;