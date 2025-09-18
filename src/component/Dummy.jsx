import React, { useEffect, useState } from "react";
import "./Dummy.css"; 

const Dummy = () => {
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="body">
      {/* Navbar */}
      <div className="nav">
        <div className="head">
          <span className="Store">fakeStore.shoping</span>
          <div className="menus">
            <span id="home">
              
              <i className="fa fa-home" style={{ fontSize: "24px" }}></i> Home
            </span>
            <span id="product">Product</span>
            <span id="contact">Contact Us</span>
            <span
              id="themeToggle"
              onClick={() => setDarkMode((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
             mode
            </span>
          </div>
          <div className="searchBar">
            <input type="search" placeholder="Search Product" />
          </div>
        </div>
      </div>

      {/* Home screen with products */}
      <div className="homeScreen">
        <div id="title">
          {products.map((item) => (
            <div id="Items" key={item.id}>
              <img src={item.image} className="imageTag" alt={item.title} />
              <h1>{item.title}</h1>
              <h4>{item.category}</h4>
              <button id="MyButton">R{item.price + 100}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>fakeStore.shopping</h2>
            <p>Your trusted source for the latest fake products.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#product">Product</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <a href="#">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fa fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 fakeStore.shopping | All rights reserved by Wilfred</p>
        </div>
      </footer>
    </div>
  );
};

export default Dummy;
