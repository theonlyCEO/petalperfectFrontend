// src/ProtectedRoute.js
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShopContext } from "./HomePageComponent/Context/ShopContext";
import SignIn from "./SignIn";
import Signup from "./Signup";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(ShopContext);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setShowSignIn(true);
    }
  }, [user]);

  // Handle popup switching
  const handleGoToSignup = () => {
    setShowSignIn(false);
    setShowSignup(true);
  };

  const handleGoToSignin = () => {
    setShowSignup(false);
    setShowSignIn(true);
  };

  const handleCloseAuth = () => {
    setShowSignIn(false);
    setShowSignup(false);
  };

  // If user is authenticated, render the protected component
  if (user) {
    return children;
  }

  // If not authenticated, show sign-in popup and redirect to home
  return (
    <>
      <Navigate to="/" replace />
      {showSignIn && (
        <SignIn 
          isOpen={true} 
          onClose={handleCloseAuth}
          onGoToSignup={handleGoToSignup}
          redirectTarget={location.pathname}
        />
      )}
      {showSignup && (
        <Signup 
          isOpen={true} 
          onClose={handleCloseAuth}
          onGoToSignin={handleGoToSignin}
          redirectTarget={location.pathname}
        />
      )}
    </>
  );
};

export default ProtectedRoute;