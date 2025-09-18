import React, { useContext, useState } from "react";
import "./Cart.css";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { useNavigate } from "react-router-dom";
import SignIn from "../SignIn";
import Signup from "../Signup";
import { FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, user } = useContext(ShopContext);
  const navigate = useNavigate();
  
  // Auth popup state
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.10; // 10% example tax
  const shipping = subtotal > 300 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (user) {
      navigate("/checkout");
    } else {
      setIsSignInOpen(true);
    }
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
  };

  return (
    <>
    <div className="cart-page">
      <h2 className="cart-title">Cart</h2>

      <div className="cart-container">
        {/* Left: Product List */}
        <div className="cart-products">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="cart-product">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-details">
                    <h4>{item.title}</h4>
                    <p>R{item.price.toFixed(2)}</p>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, Math.max(item.quantity - 1, 1))
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        +
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      Remove
                    </button>
                  </div>

                  <div className="cart-total-item">
                    R{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Actions Row */}
              <div className="cart-actions-row">
                <input type="text" placeholder="Coupon code" />
                <button className="apply-coupon">Apply Coupon</button>
                <button className="update-cart">Update Cart</button>
                <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        {cart.length > 0 && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row shipping">
              <span>Shipping</span>
              <div className="shipping-options">
                <label>
                  <input type="radio" name="shipping" defaultChecked /> Standard Delivery – R4.99
                </label>
                <label>
                  <input type="radio" name="shipping" /> Express Delivery – R12.99
                </label>
                <label>
                  <input type="radio" name="shipping" disabled={subtotal < 300} /> Free Shipping (Orders over R300)
                </label>
              </div>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>R{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>R0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Auth Popups */}
    <Signup 
      isOpen={isSignupOpen} 
      onClose={handleCloseAuth}
      onGoToSignin={handleGoToSignin}
      redirectTarget="/checkout"
    />
    <SignIn 
      isOpen={isSignInOpen} 
      onClose={handleCloseAuth}
      onGoToSignup={handleGoToSignup}
      redirectTarget="/checkout"
    />
    
    </>
  );
};

export default CartPage;