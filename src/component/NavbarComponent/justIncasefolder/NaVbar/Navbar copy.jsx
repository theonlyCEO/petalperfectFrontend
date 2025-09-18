// src/components/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="logo">Fashion<span>Store</span></div>

        <div className="search-bar">
          <input type="text" placeholder="Search for products..." />
          <button>🔍</button>
        </div>

        <div className="icons">
          <div
            className="account"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            👤 Account
            {accountOpen && (
              <div className="account-dropdown">
                <p>Welcome to FashionStore</p>
                <a href="#">My Profile</a>
                <a href="#">My Orders</a>
                <a href="#">My Wishlist</a>
                <a href="#">Returns & Refunds</a>
                <a href="#">Settings</a>
                <button>Sign In</button>
                <button>Register</button>
              </div>
            )}
          </div>

          <div className="wishlist">🤍 Wishlist</div>

          <div
            className="cart"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            🛒 Cart
            {cartOpen && (
              <div className="cart-dropdown">
                <div className="cart-item">
                  <img src="https://via.placeholder.com/50" alt="item" />
                  <span>Wireless Headphones</span>
                  <span>$99.99</span>
                </div>
                <div className="cart-item">
                  <img src="https://via.placeholder.com/50" alt="item" />
                  <span>Smart Watch</span>
                  <span>$129.99</span>
                </div>
                <div className="cart-item">
                  <img src="https://via.placeholder.com/50" alt="item" />
                  <span>Bluetooth Speaker</span>
                  <span>$59.99</span>
                </div>
                <div className="cart-total">
                  <strong>Total:</strong> $279.97
                </div>
                <div className="cart-actions">
                  <button>View Cart</button>
                  <button>Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Category</a>
        <a href="#">Product Details</a>
        <a href="#">Cart</a>
        <a href="#">Checkout</a>

        <div className="dropdown">
          <button>Dropdown ▼</button>
          <div className="dropdown-menu">
            <a href="#">Dropdown 1</a>
            <div className="deep-dropdown">
              Deep Dropdown ▼
              <div className="deep-menu">
                <a href="#">Deep Dropdown 1</a>
                <a href="#">Deep Dropdown 2</a>
                <a href="#">Deep Dropdown 3</a>
                <a href="#">Deep Dropdown 4</a>
                <a href="#">Deep Dropdown 5</a>
              </div>
            </div>
            <a href="#">Dropdown 2</a>
            <a href="#">Dropdown 3</a>
            <a href="#">Dropdown 4</a>
          </div>
        </div>

        <div className="megamenu">
          <button>Megamenu 1 ▼</button>
          <div className="megamenu-content">
            <div>
              <h4>Featured</h4>
              <img src="https://via.placeholder.com/80" alt="Product" />
              <p>Premium Headphones</p>
              <span>$129.99</span>
              <button>View Product</button>
            </div>
            <div>
              <img src="https://via.placeholder.com/80" alt="Product" />
              <p>Smart Watch</p>
              <span>$199.99</span>
              <button>View Product</button>
            </div>
            <div>
              <img src="https://via.placeholder.com/80" alt="Product" />
              <p>Wireless Earbuds</p>
              <span>$89.99</span>
              <button>View Product</button>
            </div>
          </div>
        </div>

        <div className="megamenu">
          <button>Megamenu 2 ▼</button>
          <div className="megamenu-content columns">
            <div>
              <h4>Women</h4>
              <a href="#">Shirts & Tops</a>
              <a href="#">Coats & Outerwear</a>
              <a href="#">Underwear</a>
              <a href="#">Dresses</a>
              <a href="#">Swimwear</a>
            </div>
            <div>
              <h4>Shoes</h4>
              <a href="#">Boots</a>
              <a href="#">Sandals</a>
              <a href="#">Heels</a>
              <a href="#">Loafers</a>
              <a href="#">Slippers</a>
            </div>
            <div>
              <h4>Accessories</h4>
              <a href="#">Handbags</a>
              <a href="#">Eyewear</a>
              <a href="#">Hats</a>
              <a href="#">Jewelry</a>
            </div>
            <div>
              <h4>Specialty Sizes</h4>
              <a href="#">Plus Size</a>
              <a href="#">Petite</a>
              <a href="#">Wide Shoes</a>
            </div>
          </div>
        </div>

        <a href="#">Contact</a>
      </nav>
    </header>
  );
};

export default Navbar;
 