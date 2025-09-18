import React, { useEffect } from "react";
import "./WelcomePopup.css";

const WelcomePopup = ({ userName = "User", onClose, autoClose = 1500 }) => {
  // Auto-close after `autoClose` ms
  useEffect(() => {
    if (!onClose) return;
    const t = setTimeout(() => onClose(), autoClose);
    return () => clearTimeout(t);
  }, [onClose, autoClose]);

  return (
    <div className="welcome-overlay">
      <div className="welcome-card" role="dialog" aria-live="polite">
        <div className="welcome-emoji">🎉</div>
        <h3>Welcome, {userName}!</h3>
        <p>Glad to have you back.</p>
      </div>
    </div>
  );
};

export default WelcomePopup;
