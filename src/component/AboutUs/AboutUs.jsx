import React from 'react';
import './AboutUs.css';
import { FaShoppingBasket, FaHandshake, FaTruck, FaRainbow, FaHeart, FaGlobe } from 'react-icons/fa';
import { GiPlantSeed } from 'react-icons/gi';

const AboutUs = () => {
  return (
    <>
      <div className="about-main-bg">
        <div className="about-hero">
          <div className="about-hero-text">
            <h1>
              Welcome to <span>Petal&nbsp;Perfect</span>!
            </h1>
            <p>
              Creating beauty, one bloom at a time.<br />
             we’ve poured our hearts into making moments memorable, petals perfect, and the planet greener.
            </p>
            <a href="/shop" className="shop-now-btn-large">
              <FaShoppingBasket /> Shop Now
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Florist with bouquet"
            className="about-hero-img"
          />
        </div>

        <section className="about-content">
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1509266272358-7701da638078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Flower arrangement" />
          </div>
          <div className="about-text">
            <h2>Handcrafted With Love</h2>
            <p>
              At Petal Perfect, every arrangement is a work of art, handcrafted with passion and care. Our talented team of florists brings years of experience and a personal touch to every order—big or small.
            </p>
            <p>
              <b>100% Freshness guarantee! </b>We choose each stem for lasting beauty and fragrance.
            </p>
            <div className="about-values">
              <div>
                <GiPlantSeed /> Sustainable Sourcing
              </div>
              <div>
                <FaHandshake /> Local Grower Support
              </div>
              <div>
                <FaTruck /> Fast Same-Day Delivery
              </div>
            </div>
          </div>
        </section>
        <section className="flower-benefits">
          <h2>Why Flowers Brighten Life</h2>
          <div className="flower-grid">
            <div className="flower-item">
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
                alt="Vibrant bouquet" />
              <div>
                <p>Vibrant colors energize any room <FaRainbow /></p>
              </div>
            </div>
            <div className="flower-item">
              <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
                alt="Wedding flowers" />
              <div>
                <p>Share comfort, joy, and love <FaHeart /></p>
              </div>
            </div>
            <div className="flower-item">
              <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
                alt="Eco-friendly" />
              <div>
                <p>Eco-friendly choices for a greener globe <FaGlobe /></p>
              </div>
            </div>
          </div>
        </section>
        <section className="our-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Florist Anna" />
              <p><b>Anna</b><br />Lead Designer</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="Florist Ethan" />
              <p><b>Ethan</b><br />Sourcing Expert</p>
            </div>
            <div className="team-member">
              <img src="https://randomuser.me/api/portraits/women/76.jpg" alt="Florist Mia" />
              <p><b>Mia</b><br />Delivery Chief</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;