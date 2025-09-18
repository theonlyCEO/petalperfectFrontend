import React from 'react';
import './ContactPage.css';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiInstagram, 
  FiFacebook, 
  FiMessageSquare 
} from "react-icons/fi";
import { BsFlower3 } from "react-icons/bs"; // 🌸 replacement

const GOOGLE_MAPS_EMBED_URL =
  "https://maps.app.goo.gl/WKHLUbvseTjuxUFZ9";

const ContactPage = () => (
  <div className="contact-page-outer">
    <div className="contact-page-container">
      <h1 className="contact-title">
        <BsFlower3 className="title-icon" /> Contact Us
      </h1>

      {/* Contact Details */}
      <section className="contact-section">
        <h2>Find Us</h2>
        <div className="contact-details-grid">
          <div className="contact-card">
            <FiMapPin className="contact-icon" />
            <p><strong>PetalPerfect Flower Shop</strong><br />123 Blossom Avenue,<br />Floraville, FL 54321</p>
          </div>
          <div className="contact-card">
            <FiClock className="contact-icon" />
            <p><strong>Opening Hours</strong><br />Mon–Fri: 9:00 AM – 7:00 PM<br />Sat: 10:00 AM – 5:00 PM<br />Sun: Closed</p>
          </div>
          <div className="contact-card">
            <FiPhone className="contact-icon" />
            <p><strong>Phone:</strong> <a href="tel:+1234567890">+1 234-567-890</a><br />
              <strong>Email:</strong> <a href="mailto:info@PetalPerfect.com">info@PetalPerfect.com</a></p>
          </div>
          <div className="contact-card">
            <FiMessageSquare className="contact-icon" />
            <p>
              <strong>WhatsApp:</strong> <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Chat with us</a><br />
              <FiInstagram className="inline-icon"/> <a href="https://instagram.com/beautifulblossoms" target="_blank" rel="noopener noreferrer">@PetalPerfect</a><br />
              <FiFacebook className="inline-icon"/> <a href="https://facebook.com/beautifulblossoms" target="_blank" rel="noopener noreferrer">/PetalPerfect</a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-section">
        <h2>Send Us a Message</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name *" required />
          <input type="email" placeholder="Your Email *" required />
          <input type="text" placeholder="Subject *" required />
          <textarea rows={4} placeholder="Message *" required />
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Map */}
      <section className="contact-section">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Beautiful Blossoms Location"
          ></iframe>
        </div>
      </section>
    </div>
  </div>
);

export default ContactPage;
