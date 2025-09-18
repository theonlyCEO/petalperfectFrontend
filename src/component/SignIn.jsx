import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "./HomePageComponent/Context/ShopContext";
import "./Signup.css";

const Signin = ({ isOpen, onClose, onGoToSignup, redirectTarget = "/" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Please fill in all fields.");
    }

    try {
      const res = await fetch("http://localhost:3000/checkpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const data = await res.json();
        const userObj = {
          ...data,
          userName: data.userName || data.username || data.name || data.email,
        };
        setUser(userObj);
        alert(`Login successful! Welcome, ${userObj.userName}!`);
        
        // Navigate to the intended destination
        navigate(redirectTarget);
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Signin failed");
      }
    } catch (err) {
      console.error(err);
      alert("Signin failed. Try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="flower-auth-container">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit} className="flower-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
            <p
              onClick={onGoToSignup}
              className="toggle-link"
              style={{ cursor: "pointer" }}
            >
              Don't have an account? Sign Up
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;