import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import Signup from "../Signup";
import SignIn from "../SignIn";
import "./Navbar.css";

// ICON IMPORTS
import { FiUser, FiSearch, FiHeart, FiShoppingCart, FiX, FiMenu } from "react-icons/fi";
import { GiFlowerEmblem } from "react-icons/gi";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState(null);
  // 🌟 NEW STATE FOR NAVBAR SEARCH 🌟
  const [navbarSearchTerm, setNavbarSearchTerm] = useState("");
  const { cart, wishlist, removeFromCart, user, signOut } = useContext(ShopContext);
  const navigate = useNavigate();

  const cartCount = cart.length;
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setCartOpen(false);
    setAccountOpen(false);
  };

  // 🌟 NEW FUNCTION TO HANDLE SEARCH SUBMISSION 🌟
  const handleSearch = (e) => {
    e.preventDefault(); // Prevents default form submission/page reload
    if (navbarSearchTerm.trim()) {
      // Navigate to /Category and pass the search term as a query parameter
      // This is the key to sharing the search functionality!
      navigate(`/Category?search=${encodeURIComponent(navbarSearchTerm.trim())}`);
    } else {
      // Optional: Navigate to /Category page with no search term if input is empty
      navigate("/Category");
    }
    // Clear the search bar after navigation
    setNavbarSearchTerm(""); 
    setMenuOpen(false); // Close mobile menu if open
  };

  // Handle profile link click
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/profile");
    } else {
      setRedirectTarget("/profile");
      setIsSignInOpen(true);
    }
    setAccountOpen(false);
    setMenuOpen(false);
  };

  // Handle orders link click
  const handleOrdersClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/order");
    } else {
      setRedirectTarget("/order");
      setIsSignInOpen(true);
    }
    setAccountOpen(false);
    setMenuOpen(false);
  };

  // Handle checkout link click
  const handleCheckoutClick = (e) => {
    e.preventDefault();
    
    if (user ) {
      navigate("/checkout");
    } else {
      setRedirectTarget("/checkout");
      setIsSignInOpen(true);
    }
    setAccountOpen(false);
    setMenuOpen(false);
  };

  // Handle popup switching
  const handleGoToSignup = () => {
    setIsSignInOpen(false);
    setIsSignupOpen(true);
  };

  const handleGoToSignin = () => {
    setIsSignupOpen(false);
    setIsSignInOpen(true);
  };

  const handleCloseAuth = () => {
    setIsSignInOpen(false);
    setIsSignupOpen(false);
    setRedirectTarget(null);
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <button className="burger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        <div className="logo">
          <span onClick={() => { navigate("/"); setMenuOpen(false); }}>
            Petal<GiFlowerEmblem className="logo-icon" style={{ margin: "0 5px", verticalAlign: "middle", color: "#d81b60" }} />
            <span>Perfect</span>
          </span>
        </div>

        {/* 🌟 WRAPPED SEARCH BAR IN A FORM WITH onSubmit HANDLER 🌟 */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for products..."
            // 🌟 ADDED VALUE AND onChange HANDLERS 🌟
            value={navbarSearchTerm}
            onChange={(e) => setNavbarSearchTerm(e.target.value)}
          />
          {/* Change button type to submit */}
          <button type="submit" aria-label="Search">
            <FiSearch />
          </button>
        </form>

        <div className="icons">
          {/* ... (rest of the account, wishlist, and cart icons remain the same) ... */}
          <div
            className={`account ${accountOpen ? 'open' : ''}`}
            onClick={() => {
              setAccountOpen(!accountOpen);
              setCartOpen(false);
              setMenuOpen(false);
            }}
          >
            <FiUser style={{ verticalAlign: "middle" }} /> 
            <span className="label">{user ? user.userName : "Account"}</span>
            <div className="account-dropdown">
              <p>
                {user
                  ? `Welcome, ${user.userName}!`
                  : <>Welcome to Petal Perfect <GiFlowerEmblem style={{ verticalAlign: "text-bottom", color: "#d81b60" }} /></>
                }
              </p>
              {user ? (
                <>
                  <a href="#" onClick={handleProfileClick}>My Profile</a>
                  <a href="#" onClick={handleOrdersClick}>My Orders</a>
                  <a href="#" onClick={() => { navigate("/wishlist"); setMenuOpen(false); }}>
                    My Wishlist ({wishlist.length})
                  </a>
                  
                  <button
                    className="sign-in"
                    onClick={() => {
                      signOut();
                      setAccountOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href="#" onClick={handleProfileClick}>My Profile</a>
                  <a href="#" onClick={handleOrdersClick}>My Orders</a>
                  <a href="#" onClick={() => { navigate("/wishlist"); setMenuOpen(false); }}>
                    My Wishlist ({wishlist.length})
                  </a>
                  
                  <button
                    className="sign-in"
                    onClick={() => {
                      setRedirectTarget(null);
                      setIsSignInOpen(true);
                      setAccountOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="register"
                    onClick={() => {
                      setRedirectTarget(null);
                      setIsSignupOpen(true);
                      setAccountOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="wishlist" onClick={() => { navigate("/wishlist"); setMenuOpen(false); }}>
            <FiHeart style={{ verticalAlign: "middle" }} /> 
            <span className="label">Wishlist ({wishlist.length})</span>
          </div>

          <div
            className={`cart ${cartOpen ? 'open' : ''}`}
            onClick={() => {
              setCartOpen(!cartOpen);
              setAccountOpen(false);
              setMenuOpen(false);
            }}
          >
            <FiShoppingCart style={{ verticalAlign: "middle" }} /> 
            <span className="label" >Cart <span id ="carts">({cartCount})</span></span>
            <div className="cart-dropdown">
              <h4>Your Cart</h4>
              {cart.length === 0 ? (
                <p className="empty">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <img src={item.image} alt={item.title} />
                      <div className="cart-item-details">
                        <span>{item.title}</span>
                        <span>R{item.price}</span>
                        <small>Qty: {item.quantity}</small>
                        <button
                          className="remove-btn"
                          aria-label={`Remove ${item.title} from cart`}
                          onClick={() => removeFromCart(item._id)}
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>R{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-actions">
                    <button className="view-cart" onClick={() => { navigate("/cart"); setMenuOpen(false); }}>
                      View Cart
                    </button>
                    <button className="checkout" onClick={handleCheckoutClick}>Checkout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <a href="#" onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</a>
        <a href="#" onClick={() => { navigate("/AboutUs"); setMenuOpen(false); }}>About</a>
        <Link to="/Category" onClick={() => setMenuOpen(false)}><a href="#">Category</a></Link>
        <a href="#" onClick={() => { navigate("/cart"); setMenuOpen(false); }}>Cart<span className="carts">({cart.length})</span></a>
        <a href="#" onClick={() => { navigate("/contactus"); setMenuOpen(false); }}>Contact</a>
      </nav>

      <Signup 
        isOpen={isSignupOpen} 
        onClose={handleCloseAuth}
        onGoToSignin={handleGoToSignin}
        redirectTarget={redirectTarget}
      />
      <SignIn 
        isOpen={isSignInOpen} 
        onClose={handleCloseAuth}
        onGoToSignup={handleGoToSignup}
        redirectTarget={redirectTarget}
      />
    </header>
  );
};

export default Navbar;