import React, { useContext, useState, useEffect } from "react";
import "./CheckOutPage.css";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { useIp } from "../../context/IpContext"; // Import the useIp hook
import { useNavigate } from "react-router-dom";
import Signin from "../SignIn";
import Signup from "../Signup";

const ConfettiIcon = () => (
  <svg style={{width:'2.2em',height:'2.2em',verticalAlign:'middle',marginRight:".5em"}} viewBox="0 0 48 48" fill="none">
    <path d="M6 42l6.2-23.8C12.7 16.1 15 14 18 14h12c3 0 5.3 2.1 5.8 4.2L42 42c.2 1.1-1 2-2 2H8c-1 0-2-1-2-2z" fill="#FCEA2B"/>
    <path d="M24 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" fill="#EA5A47"/>
    <circle cx="38" cy="10" r="2" fill="#B1CC33"/>
    <circle cx="10" cy="10" r="2" fill="#92D3F5"/>
    <circle cx="24" cy="42" r="2" fill="#F4AA41"/>
    <circle cx="38" cy="38" r="2" fill="#EA5A47"/>
    <circle cx="10" cy="38" r="2" fill="#B1CC33"/>
  </svg>
);

const CheckoutPage = () => {
  const { ip } = useIp(); // Access the IP from context
  const { cart, clearCart, user } = useContext(ShopContext);
  const navigate = useNavigate();

  // Modal state for auth if needed
  const [authModal, setAuthModal] = useState({
    open: false,
    type: "signin"
  });

  // Order success modal
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (!user) setAuthModal({ open: true, type: "signin" });
  }, [user]);

  // Fill form with user info on signin
  const [form, setForm] = useState({
    name: user ? user.userName : "",
    email: user ? user.email : "",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "card",
    card: "",
    expiry: "",
    cvc: "",
    upi: "",
    cash: false,
  });

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.userName,
        email: user.email,
      }));
      setAuthModal({ open: false, type: "signin" });
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 4.99;
  const tax = subtotal * 0.10;
  const total = subtotal + tax + shipping;

  const handleInput = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePaymentChange = (e) => {
    setForm((prev) => ({
      ...prev,
      paymentMethod: e.target.value,
    }));
  };

  // ==== NEW ORDER SUBMIT ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModal({ open: true, type: "signin" });
      return;
    }
    
    // Call backend to place order!
    const res = await fetch(`http://${ip}:3000/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        cart: cart,
        address: form.address,
        city: form.city,
        zip: form.zip,
        paymentMethod: form.paymentMethod,
        name: form.name,
        total: total
      }),
    });
    if (res.ok) {
      await fetch(`http://${ip}:3000/cart/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        navigate("/");
      }, 2000);
    } else {
      alert('Order failed. Please try again.');
    }
  };

  // Auth Modal logic
  const handleGoToSignup = () => setAuthModal({ open: true, type: "signup" });
  const handleGoToSignin = () => setAuthModal({ open: true, type: "signin" });
  const handleCloseModal = () => setAuthModal({ open: false, type: "signin" });

  if (!user && authModal.open) {
    return (
      <>
        {authModal.type === "signin" ? (
          <Signin
            isOpen={true}
            onClose={handleCloseModal}
            onGoToSignup={handleGoToSignup}
          />
        ) : (
          <Signup
            isOpen={true}
            onClose={handleCloseModal}
            onGoToSignin={handleGoToSignin}
          />
        )}
      </>
    );
  }

  return (
    <>
      {orderSuccess && (
        <div className="order-success-modal">
          <ConfettiIcon />
          <span>Order placed!</span>
        </div>
      )}
      <div className="checkout-page">
        <h2>Checkout</h2>
        <div className="checkout-container">
          {/* Order Summary */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} className="checkout-item">
                <img src={item.image} alt={item.title} />
                <div>{item.title} x {item.quantity}</div>
                <div>R{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <hr />
            <div className="summary-row">Subtotal: <span>R{subtotal.toFixed(2)}</span></div>
            <div className="summary-row">Shipping: <span>R{shipping.toFixed(2)}</span></div>
            <div className="summary-row">Tax (10%): <span>R{tax.toFixed(2)}</span></div>
            <div className="summary-row"><strong>Total:</strong> <span><strong>R{total.toFixed(2)}</strong></span></div>
          </div>
          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Billing Details</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input required name="name" placeholder="Full Name" value={form.name} onChange={handleInput} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input required name="email" type="email" placeholder="Email" value={form.email} onChange={handleInput} />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input required name="address" placeholder="Address" value={form.address} onChange={handleInput} />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input required name="city" placeholder="City" value={form.city} onChange={handleInput} />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP / Postal</label>
              <input required name="zip" placeholder="ZIP / Postal" value={form.zip} onChange={handleInput} />
            </div>

            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className={`payment-radio${form.paymentMethod === "card" ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={form.paymentMethod === "card"}
                  onChange={handlePaymentChange}
                />
                Card
              </label>
              <label className={`payment-radio${form.paymentMethod === "upi" ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={form.paymentMethod === "upi"}
                  onChange={handlePaymentChange}
                />
                UPI
              </label>
              <label className={`payment-radio${form.paymentMethod === "cash" ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={form.paymentMethod === "cash"}
                  onChange={handlePaymentChange}
                />
                Cash on Delivery
              </label>
            </div>
            {/* Card, UPI, Cash details can show here as in your previously working UI */}
            <button className="place-order-btn" type="submit">Place Order</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;