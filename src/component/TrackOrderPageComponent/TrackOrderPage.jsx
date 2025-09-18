import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import "./TrackOrderPage.css";
import { FaSearch, FaTruck, FaBoxOpen, FaCheck, FaClock, FaMapMarkerAlt, FaCog, FaHome, FaRoute, FaCalendarAlt } from "react-icons/fa";

const TrackOrderPage = () => {
  const { user, getUserOrders, trackOrder, findOrderByPartialId } = useContext(ShopContext);
  const [orderInput, setOrderInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Delivery tracking state
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [deliveryStages] = useState([
    { 
      name: "Order Placed", 
      icon: <FaBoxOpen />, 
      description: "Order received and confirmed",
      duration: 0.5 // 0.5 days
    },
    { 
      name: "Processing", 
      icon: <FaCog />, 
      description: "Preparing your beautiful flowers",
      duration: 1 // 1 day
    },
    { 
      name: "Shipped", 
      icon: <FaTruck />, 
      description: "On the way to you",
      duration: 1.5 // 1.5 days
    },
    { 
      name: "Out for Delivery", 
      icon: <FaRoute />, 
      description: "Delivery in progress",
      duration: 0.5 // 0.5 days
    },
    { 
      name: "Delivered", 
      icon: <FaHome />, 
      description: "Enjoy your flowers!",
      duration: 0
    }
  ]);

  // Fetch user orders on mount
  useEffect(() => {
    if (user?.email) {
      fetchUserOrdersData();
    }
  }, [user]);

  const fetchUserOrdersData = async () => {
    try {
      const result = await getUserOrders();
      if (result.success) {
        setUserOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Calculate delivery progress
  useEffect(() => {
    if (!selectedOrder?.createdAt && !selectedOrder?.date) return;

    const calculateProgress = () => {
      const orderDate = new Date(selectedOrder.createdAt || selectedOrder.date);
      const now = new Date();
      const timeSinceOrder = (now - orderDate) / (1000 * 60 * 60 * 24); // days

      // Calculate total delivery time based on flower type and order complexity
      const baseDeliveryDays = 3; // Standard 3 days
      const itemComplexity = (selectedOrder.cart || []).length > 5 ? 1 : 0; // Extra day for large orders
      const totalDeliveryDays = baseDeliveryDays + itemComplexity;

      // Calculate estimated delivery date
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + totalDeliveryDays);
      setEstimatedDelivery(deliveryDate);

      // Calculate cumulative stage durations
      const stageDurations = deliveryStages.map(stage => stage.duration);
      const cumulativeDurations = stageDurations.reduce((acc, duration, index) => {
        acc.push((acc[index - 1] || 0) + duration);
        return acc;
      }, []);

      // Determine current stage and progress
      let stage = 0;
      let progress = 0;

      if (timeSinceOrder >= totalDeliveryDays) {
        // Order is delivered
        stage = deliveryStages.length - 1;
        progress = 100;
      } else {
        // Find current stage
        for (let i = 0; i < cumulativeDurations.length - 1; i++) {
          if (timeSinceOrder >= cumulativeDurations[i]) {
            stage = i + 1;
          }
        }

        // Calculate progress within current stage
        const stageStart = stage > 0 ? cumulativeDurations[stage - 1] : 0;
        const stageEnd = cumulativeDurations[stage];
        const stageProgress = stage < deliveryStages.length - 1 
          ? Math.min(100, Math.max(0, ((timeSinceOrder - stageStart) / (stageEnd - stageStart)) * 100))
          : 100;

        progress = ((stage / (deliveryStages.length - 1)) * 100) + (stageProgress / (deliveryStages.length - 1));
        progress = Math.min(100, Math.max(0, progress));
      }

      setCurrentStage(stage);
      setCurrentProgress(progress);

      // Calculate time remaining
      const timeLeft = deliveryDate - now;
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        setTimeRemaining("Delivered!");
      }
    };

    calculateProgress();

    // Update every minute
    const interval = setInterval(calculateProgress, 60000);
    return () => clearInterval(interval);
  }, [selectedOrder, deliveryStages]);

  const handleTrackOrder = async () => {
    if (!orderInput.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First try to find in user's orders if logged in
      if (user?.email) {
        const userOrderResult = await findOrderByPartialId(orderInput);
        if (userOrderResult.success) {
          setSelectedOrder(userOrderResult.data);
          setLoading(false);
          return;
        }
      }

      // Try to fetch from API with full ID
      const trackResult = await trackOrder(orderInput);
      if (trackResult.success) {
        setSelectedOrder(trackResult.data);
      } else {
        setError("Order not found. Please check your order ID.");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (order) => {
    setOrderInput((order._id || order.id)?.toString().slice(-6) || "");
    setSelectedOrder(order);
    setError("");
  };

  const handleNewSearch = () => {
    setSelectedOrder(null);
    setOrderInput("");
    setError("");
    setCurrentProgress(0);
    setCurrentStage(0);
    setTimeRemaining("");
    setEstimatedDelivery(null);
  };

  return (
    <>

      <div className="track-order-page">
        <div className="track-header">
          <h1><FaTruck /> Track Your Order</h1>
          <p>Enter your order ID to see real-time delivery progress</p>
        </div>

        {/* Order Input Section */}
        {!selectedOrder && (
          <>
            <div className="track-input-section">
              <div className="track-input-container">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g., abc123)"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                  className="track-input"
                />
                <button 
                  onClick={handleTrackOrder}
                  disabled={loading}
                  className="track-button"
                >
                  {loading ? <FaClock className="spinning" /> : <FaSearch />}
                  {loading ? "Searching..." : "Track Order"}
                </button>
              </div>
              {error && <div className="track-error">{error}</div>}
            </div>

            {/* Quick Select from Recent Orders */}
            {user && userOrders.length > 0 && (
              <div className="quick-select-section">
                <h3>Or select from your recent orders:</h3>
                <div className="recent-orders-grid">
                  {userOrders.slice(0, 6).map(order => (
                    <div 
                      key={order._id || order.id}
                      className="recent-order-card"
                      onClick={() => handleQuickSelect(order)}
                    >
                      <div className="order-id">
                        #{(order._id || order.id)?.toString().slice(-6)}
                      </div>
                      <div className="order-date">
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </div>
                      <div className="order-items">
                        {(order.cart || []).slice(0, 2).map(item => (
                          <img key={item._id} src={item.image} alt={item.title} className="order-item-thumb" />
                        ))}
                        {order.cart && order.cart.length > 2 && (
                          <span className="more-items">+{order.cart.length - 2}</span>
                        )}
                      </div>
                      <div className="order-total">R{order.total?.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Delivery Tracking Display */}
        {selectedOrder && (
          <div className="tracking-display">
            <div className="tracking-header">
              <div className="order-summary">
                <h2>Order #{(selectedOrder._id || selectedOrder.id)?.toString().slice(-6)}</h2>
                <div className="order-meta">
                  <span><FaBoxOpen /> {selectedOrder.cart?.length || 0} items</span>
                  <span><FaMapMarkerAlt /> {selectedOrder.shippingAddress || selectedOrder.address || "Default Address"}</span>
                  <span><FaCalendarAlt /> {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString()}</span>
                  <span>Total: R{selectedOrder.total?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
              <button className="new-search-btn" onClick={handleNewSearch}>
                <FaSearch /> Track Another Order
              </button>
            </div>

            {/* Dynamic Delivery Progress */}
            <div className="delivery-tracker">
              <div className="delivery-header">
                <h3>🚚 Delivery Progress</h3>
                <div className="delivery-eta">
                  <FaClock />
                  <span>
                    {currentStage === deliveryStages.length - 1 
                      ? "✅ Delivered!" 
                      : `📅 Estimated delivery: ${timeRemaining} remaining`
                    }
                  </span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${currentProgress}%` }}
                  />
                  <div 
                    className="delivery-truck-icon"
                    style={{ left: `${Math.min(currentProgress, 95)}%` }}
                  >
                    🚚
                  </div>
                </div>
                <div className="progress-labels">
                  <span>Order Placed</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Delivery Stages */}
              <div className="delivery-stages">
                {deliveryStages.map((stage, index) => (
                  <div 
                    key={index}
                    className={`delivery-stage ${
                      index < currentStage ? 'completed' : 
                      index === currentStage ? 'active' : 'pending'
                    }`}
                  >
                    <div className="stage-icon">
                      {index < currentStage ? <FaCheck /> : stage.icon}
                    </div>
                    <div className="stage-content">
                      <h4>{stage.name}</h4>
                      <p>{stage.description}</p>
                      {index === currentStage && currentStage < deliveryStages.length - 1 && (
                        <div className="stage-timer">
                          <FaClock className="timer-icon pulsing" />
                          <span>In progress...</span>
                        </div>
                      )}
                      {index < currentStage && (
                        <div className="stage-completed">
                          <FaCheck className="check-icon" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                    <div className="stage-time">
                      {index <= currentStage && (
                        <span className="time-estimate">
                          {index < currentStage ? "✓" : "~" + stage.duration * 24 + "hrs"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Map Animation */}
              <div className="delivery-map">
                <h4>📍 Live Delivery Route</h4>
                <div className="map-container">
                  <div className="route-line">
                    <div 
                      className="route-progress"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                  <div className="map-points">
                    <div className="map-point warehouse">
                      <div className="point-icon warehouse-icon">🏭</div>
                      <span>Petal Perfect Warehouse</span>
                    </div>
                    <div 
                      className="map-point delivery-truck"
                      style={{ left: `${Math.min(currentProgress, 90)}%` }}
                    >
                      <div className="point-icon truck-icon">
                        <FaTruck className="moving-truck" />
                      </div>
                    </div>
                    <div className="map-point destination">
                      <div className="point-icon destination-icon">🏠</div>
                      <span>Your Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information Cards */}
            <div className="delivery-details">
              <div className="detail-card delivery-info">
                <h4><FaTruck /> Delivery Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estimated Delivery:</span>
                    <span className="info-value">
                      {estimatedDelivery?.toLocaleDateString()} by 6:00 PM
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Delivery Address:</span>
                    <span className="info-value">{selectedOrder.shippingAddress || selectedOrder.address || "Default Address"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Delivery Method:</span>
                    <span className="info-value">Standard Delivery (2-3 business days)</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Current Status:</span>
                    <span className={`status-badge status-${currentStage}`}>
                      {deliveryStages[currentStage]?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="detail-card order-summary-card">
                <h4><FaBoxOpen /> Order Summary</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Items:</span>
                    <span className="info-value">{selectedOrder.cart?.length || 0} flower arrangements</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Value:</span>
                    <span className="info-value total-amount">R{selectedOrder.total?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Status:</span>
                    <span className="info-value payment-confirmed">✅ Confirmed</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Delivery Type:</span>
                    <span className="info-value">Fresh Flower Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Details */}
            <div className="order-items-detail">
              <h3><FaBoxOpen /> Your Beautiful Flowers</h3>
              <div className="items-grid">
                {(selectedOrder.cart || []).map(item => (
                  <div key={item._id || item.id} className="item-detail-card">
                    <img src={item.image} alt={item.title} />
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p className="item-category">{item.category}</p>
                      <p>Quantity: <span className="quantity-badge">{item.quantity || 1}</span></p>
                      <p className="item-price">R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                    <div className="item-status">
                      {currentStage >= 2 ? (
                        <span className="item-shipped">📦 Shipped</span>
                      ) : currentStage >= 1 ? (
                        <span className="item-processing">⚙️ Processing</span>
                      ) : (
                        <span className="item-placed">📋 Placed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Timeline Updates */}
            <div className="live-updates">
              <h4>📍 Live Tracking Timeline</h4>
              <div className="timeline">
                {deliveryStages.slice(0, currentStage + 1).map((stage, index) => (
                  <div key={index} className="timeline-item">
                    <div className={`timeline-dot ${index === currentStage ? 'active' : 'completed'}`}>
                      {index < currentStage ? <FaCheck /> : stage.icon}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h5>{stage.name}</h5>
                        <span className="timeline-time">
                          {index < currentStage 
                            ? "✅ Completed" 
                            : index === currentStage 
                              ? "🔄 In Progress" 
                              : "⏳ Pending"
                          }
                        </span>
                      </div>
                      <p>{stage.description}</p>
                      {index === currentStage && currentStage < deliveryStages.length - 1 && (
                        <div className="current-activity">
                          <div className="activity-indicator">
                            <div className="activity-dot"></div>
                            <div className="activity-dot"></div>
                            <div className="activity-dot"></div>
                          </div>
                          <span>Working on this step...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Delivery Notes */}
            <div className="delivery-notes">
              <h4>🌸 Special Care Instructions</h4>
              <div className="notes-content">
                <p>• Your flowers are being handled with extra care to ensure freshness</p>
                <p>• Temperature-controlled transport maintains optimal conditions</p>
                <p>• Our delivery team will contact you 1 hour before arrival</p>
                <p>• If you're not available, we'll leave them with a trusted neighbor</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackOrderPage;