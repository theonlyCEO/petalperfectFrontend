import React from 'react';
import './footer.css';

// Import icons
import { GiFlowerEmblem } from 'react-icons/gi';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-section">
          <h3>Shop</h3>
          <ul>
            <li>Daily Deals</li>
            <li>Gift Vouchers</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Help</h3>
          <ul>
            <li>Help Centre</li>
            <li>Contact Us</li>
            <li>Shipping & Delivery</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-social">
          <span>Follow us:&nbsp;</span>
          <span className="icon"><GiFlowerEmblem /></span>
          <span className="icon"><FaInstagram /></span>
          <span className="icon"><FaTwitter /></span>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Petal Perfect
        </div>
      </div>
    </footer>
  );
};

export default Footer;