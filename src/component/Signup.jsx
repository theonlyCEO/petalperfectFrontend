import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "./HomePageComponent/Context/ShopContext";
import { useIp } from "../context/IpContext"; // Import the useIp hook
import "./Signup.css";

const Signup = ({ isOpen, onClose, onGoToSignin, redirectTarget = "/" }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(ShopContext);
  const { ip } = useIp(); // Access the IP from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password || !confirmPassword) {
      return alert("Please fill in all fields.");
    }
    if (password !== confirmPassword) {
      return alert("Passwords don't match");
    }

    try {
      const res = await fetch(`http://${ip}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password, confirmPassword }), // IP is now in the URL, not body
      });

      if (res.status === 201) {
        const data = await res.json();
        const userObj = {
          ...data,
          userName: data.userName || data.username || data.name || data.email,
        };
        setUser(userObj);
        alert(`Signup successful! Welcome, ${userObj.userName}!`);
        
        // Navigate to the intended destination
        navigate(redirectTarget);
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed. Try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="flower-auth-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className="flower-form">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
            <p
              onClick={onGoToSignin}
              className="toggle-link"
              style={{ cursor: "pointer" }}
            >
              Already have an account? Sign In
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;