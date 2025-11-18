import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import Signup from '../Signup';
import Signin from '../SignIn';
import "./OrderPage.css";
import { Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const OrderPage = () => {
  const { user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    // Fetch real user orders from backend using IP context
    fetch(`${API_BASE_URL}/orders?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        // Sort orders by date descending
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
  }, [user, API_BASE_URL]);

  if (!user) {
    return (
      <div className="order-page-container not-signed-in">
        <h2 className="order-page-title">My Orders</h2>
        <div className="sign-in-prompt">
          <p>Please **sign in** or **create an account** to view your order history.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="order-page-container">
        <h2 className="order-page-title">📦 My Orders</h2>
        {loading ? (
          <p className="loading-message">Loading your orders...</p>
        ) : (
          <>
            {orders.length === 0 ? (
              <div className="empty-orders">
                <h3>You haven't placed any orders yet.</h3>
                <p>Browse our products and start shopping!</p>
                <Link to="/">
                  <button className="start-shopping-btn">Start Shopping</button>
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => {
                  const orderIdLastSix = (order._id || order.id)?.toString().slice(-6);
                  const orderDate = new Date(order.createdAt || order.date);
                  const status = order.status || 'Placed';
                  
                  return (
                    <div key={order._id || order.id} className="order-card">
                      <div className="order-header">
                        <div className="header-left">
                          <span>Order #<span className="order-id-short">**{orderIdLastSix}**</span></span>
                          <span className="order-date">{orderDate.toLocaleDateString()}</span>
                        </div>
                        <span className={`order-status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                          {status}
                        </span>
                      </div>
                      
                      <div className="order-items-list">
                        {order.cart.map((item, index) => (
                          <div className="order-item-detail" key={item._id || index}>
                            <img src={item.image} alt={item.title} className="item-thumbnail" />
                            <div className="item-info">
                              <p className="item-name">**{item.title}**</p>
                              <p className="item-qty-price">
                                R{item.price?.toFixed(2)} x {item.quantity || 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-summary-footer">
                        <div className="order-total-display">
                          **Order Total:** <span className="total-amount">R{order.total?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="order-actions">
                          <Link to="/track-order" className="action-link">
                            <button className="btn-secondary">Track Order</button>
                          </Link>
                          <button className="btn-primary reorder-btn">Reorder</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      {/* Removed unused Auth Popups in the final render */}
    </>
  );
};

export default OrderPage;