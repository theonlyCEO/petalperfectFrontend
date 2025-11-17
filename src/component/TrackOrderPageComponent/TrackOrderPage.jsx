import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import "./TrackOrderPage.css";
import { FaSearch, FaTruck, FaBoxOpen, FaCheck, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaRoute } from "react-icons/fa";

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
      description: "Order received and confirmed, starting preparation.",
      duration: 0.5 
    },
    { 
      name: "Processing & Packaging", 
      icon: <FaCheck />, // Changed from FaCog for a cleaner look
      description: "Your beautiful arrangement is being prepared and packed.",
      duration: 1
    },
    { 
      name: "Shipped from Warehouse", 
      icon: <FaTruck />, 
      description: "Your package has left the facility.",
      duration: 1.5 
    },
    { 
      name: "Out for Delivery", 
      icon: <FaRoute />, 
      description: "The final leg: delivery is in progress to your address.",
      duration: 0.5
    },
    { 
      name: "Delivered", 
      icon: <FaCheck />, 
      description: "Your order has been successfully delivered. Enjoy!",
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
        setUserOrders(result.data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))); // Sort by most recent
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Calculation logic (kept the same, assuming it works)
  useEffect(() => {
    if (!selectedOrder?.createdAt && !selectedOrder?.date) return;

    const calculateProgress = () => {
      const orderDate = new Date(selectedOrder.createdAt || selectedOrder.date);
      const now = new Date();
      const timeSinceOrder = (now - orderDate) / (1000 * 60 * 60 * 24); 

      // Total delivery time calculation
      const baseDeliveryDays = 3; 
      const itemComplexity = (selectedOrder.cart || []).length > 5 ? 1 : 0; 
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
        stage = deliveryStages.length - 1;
        progress = 100;
      } else {
        for (let i = 0; i < cumulativeDurations.length - 1; i++) {
          if (timeSinceOrder >= cumulativeDurations[i]) {
            stage = i + 1;
          }
        }

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
        
        let timeString = "";
        if (days > 0) timeString += `${days}d `;
        if (hours > 0 || days > 0) timeString += `${hours}h `;
        timeString += `${minutes}m`;

        setTimeRemaining(timeString.trim());
      } else {
        setTimeRemaining("Delivered!");
      }
    };

    calculateProgress();

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
      // Implementation simplified, assuming one of these will retrieve the full order object
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
    <div className="track-order-page">
      <div className="track-header">
        <h1><FaTruck /> Track Your Delivery</h1>
        <p>Enter your order ID or select a recent order below.</p>
      </div>

      {/* Order Input Section */}
      {!selectedOrder && (
        <>
          <div className="track-input-section">
            <div className="track-input-container">
              <input
                type="text"
                placeholder="Enter Order ID (e.g., ABC123)"
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

          {/* Quick Select from Recent Orders (If logged in) */}
          {user && userOrders.length > 0 && (
            <div className="quick-select-section">
              <h3>Your Recent Orders:</h3>
              <div className="recent-orders-grid">
                {userOrders.slice(0, 4).map(order => ( // Reduced to 4 for simplicity
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
                    <div className="order-total">
                      R{order.total?.toFixed(2)}
                    </div>
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
          <div className="tracking-summary-bar">
            <div className="order-summary-left">
              <h2>Order #{(selectedOrder._id || selectedOrder.id)?.toString().slice(-6)}</h2>
              <span><FaCalendarAlt /> Ordered: {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString()}</span>
              <span><FaMapMarkerAlt /> Shipping to: {selectedOrder.shippingAddress || selectedOrder.address || "Default Address"}</span>
            </div>
            <div className="order-summary-right">
              <span className={`status-main status-${currentStage}`}>
                **Status: {deliveryStages[currentStage]?.name}**
              </span>
              <button className="new-search-btn" onClick={handleNewSearch}>
                <FaSearch /> New Search
              </button>
            </div>
          </div>

          {/* ETA/Progress Indicator - Simplified */}
          <div className="delivery-eta-bar">
            <div className="delivery-eta-info">
              <FaClock />
              {currentStage === deliveryStages.length - 1 
                ? "**Delivered!**" 
                : `Estimated delivery: **${estimatedDelivery?.toLocaleDateString()}** (${timeRemaining} remaining)`
              }
            </div>
          </div>

          {/* Live Timeline Updates - This is the main tracking view */}
          <div className="live-updates">
            <h3>Detailed Tracking Timeline</h3>
            <div className="timeline">
              {deliveryStages.map((stage, index) => (
                <div key={index} className={`timeline-item ${
                    index < currentStage ? 'completed' : 
                    index === currentStage ? 'active' : 'pending'
                  }`}>
                  <div className="timeline-dot">
                    {index < currentStage ? <FaCheck /> : stage.icon}
                  </div>
                  <div className="timeline-content">
                    <h5>{stage.name}</h5>
                    <p>{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items Card - Simplified */}
          <div className="simple-order-items-card">
            <h4><FaBoxOpen /> Order Contents</h4>
            <div className="item-thumbnails-list">
              {(selectedOrder.cart || []).slice(0, 4).map(item => (
                <div key={item._id || item.id} className="item-thumb-wrapper">
                  <img src={item.image} alt={item.title} className="item-thumbnail-small" />
                  <span className="item-qty-badge">{item.quantity || 1}</span>
                </div>
              ))}
              {(selectedOrder.cart || []).length > 4 && (
                <div className="item-thumb-wrapper more-items-badge">
                  +{(selectedOrder.cart || []).length - 4} More
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;