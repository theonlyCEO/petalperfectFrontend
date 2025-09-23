import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { useIp } from "../../context/IpContext"; // Import the useIp hook
import Signup from '../Signup';
import Signin from '../SignIn';
import "./OrderPage.css";
import { Link } from 'react-router-dom';

const OrderPage = () => {
  const { user } = useContext(ShopContext);
  const { ip } = useIp(); // Access the IP from context
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    // Fetch real user orders from backend using IP context
    fetch(`http://${ip}:3000/orders?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
  }, [user, ip]); // Added ip to dependency array

  if (!user) {
    return (
      <>
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 20, textAlign: 'center' }}>
          <h2>My Orders</h2>
          <p>Please sign in to view your orders.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h2>My Orders</h2>
        {loading ? (
          <p>Loading your orders...</p>
        ) : (
          <>
            {orders.length === 0 ? (
              <p>No orders found. Start shopping to see your orders here!</p>
            ) : (
              <div className="orders-container">
                {orders.map(order => (
                  <div key={order._id || order.id} className="order-card">
                    <div className="order-header">
                      <span><strong>Order ID:</strong> {(order._id || order.id)?.toString().slice(-6)}</span>
                      <span><strong>Date:</strong> {(order.createdAt || order.date || '').slice(0,10)}</span>
                      <span className={`order-status ${(order.status || 'Placed').toLowerCase().replace(' ', '-')}`}>
                        {order.status || 'Placed'}
                      </span>
                    </div>
                    
                    <div className="order-items">
                      <h4>Items:</h4>
                      {(order.cart || []).map((item, index) => (
                        <div className="order-item" key={item._id || index}>
                          <img src={item.image} alt={item.title} />
                          <div className="item-details">
                            <span className="item-name">{item.title}</span>
                            <span className="item-quantity">Quantity: {item.quantity || 1}</span>
                            <span className="item-price">R{item.price?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: R{order.total?.toFixed(2) || '0.00'}</strong>
                      </div>
                      <div className="order-actions">
                        <Link to="/track-order"><button className="track-order">Track Order</button></Link>
                        <button className="reorder">Reorder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Auth Popups */}
      <Signup 
        isOpen={false} 
        onClose={() => {}}
        onGoToSignin={() => {}}
      />
      <Signin 
        isOpen={false} 
        onClose={() => {}}
        onGoToSignup={() => {}}
      />
      
    </>
  );
};

export default OrderPage;