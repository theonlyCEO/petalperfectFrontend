import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { useIp } from "../../context/IpContext"; // Import the useIp hook
import "./ProfilePage.css";
import { FaEye, FaEyeSlash, FaCog, FaBell, FaTruck, FaHeart, FaShieldAlt, FaDownload, FaTrash } from "react-icons/fa";

const avatarChoices = [
  "https://4kwallpapers.com/images/walls/thumbs/23672.jpeg",
  "https://4kwallpapers.com/images/walls/thumbs/23621.jpg",
  "https://4kwallpapers.com/images/walls/packs/102.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23603.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23608.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23231.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23159.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23155.jpg",
  "https://4kwallpapers.com/images/walls/thumbs/23267.png",
  "https://4kwallpapers.com/images/walls/thumbs/23185.jpg"
];

const ProfilePage = () => {
  const { user, signOut, setUser } = useContext(ShopContext);
  const { ip } = useIp(); // Access the IP from context

  // State for fetched info
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const [avatarPick, setAvatarPick] = useState(null);

  // Settings state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Settings preferences state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    priceAlerts: false,
    defaultDeliveryTime: "morning",
    flowerPreferences: [],
    allergyInfo: "",
    autoReorder: false,
    wishlistPublic: false
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate dynamic stats
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const favoriteCategory = orders.length > 0 
    ? orders.flatMap(o => o.cart || [])
        .reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {})
    : {};
  const topCategory = Object.keys(favoriteCategory).reduce((a, b) => 
    favoriteCategory[a] > favoriteCategory[b] ? a : b, "None"
  );

  // Fetch all user info on mount
  useEffect(() => {
    if (!user?.email) return;
    
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileRes = await fetch(`http://${ip}:3000/users?email=${user.email}`);
        const profileData = await profileRes.json();
        
        setProfile(profileData);
        setEditInfo({
          userName: profileData.userName || "",
          username: profileData.username || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          avatar: profileData.avatar || avatarChoices[0]
        });
        setAvatarPick(profileData.avatar || avatarChoices[0]);
        
        // Load user settings if available
        if (profileData.settings) {
          setSettings(prev => ({ ...prev, ...profileData.settings }));
        }

        // Fetch orders, cart, wishlist in parallel
        const [ordersRes, cartRes, wishlistRes] = await Promise.all([
          fetch(`http://${ip}:3000/orders?email=${user.email}`),
          fetch(`http://${ip}:3000/carts?email=${user.email}`),
          fetch(`http://${ip}:3000/wishlist?email=${user.email}`)
        ]);

        const [ordersData, cartData, wishlistData] = await Promise.all([
          ordersRes.json(),
          cartRes.json(),
          wishlistRes.json()
        ]);

        setOrders(ordersData);
        setCart(cartData);
        setWishlist(wishlistData);
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  // Handlers for edit mode
  const handleChange = e => {
    const { name, value } = e.target;
    setEditInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = url => {
    setAvatarPick(url);
    setEditInfo(prev => ({ ...prev, avatar: url }));
  };

  // Settings handlers
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const handleSave = async () => {
    if(!profile?._id) return alert("Profile not loaded!");
    
    try {
      const updateData = {
        ...editInfo,
        avatar: avatarPick,
        settings: settings
      };

      const res = await fetch(`http://${ip}:3000/users/${profile._id}`, {
        method: 'PUT',
        headers: { "Content-Type":"application/json"},
        body: JSON.stringify(updateData)
      });
      
      if(res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setUser({ ...user, ...editInfo, avatar: avatarPick });
        setEditMode(false);
        alert("Profile and settings updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  // Save password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords don't match!");
    }
    if (passwordData.newPassword.length < 6) {
      return alert("Password must be at least 6 characters!");
    }

    try {
      const res = await fetch(`http://${ip}:3000/users/${profile._id}/password`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (res.ok) {
        alert("Password updated successfully!");
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update password. Check your current password.");
      }
    } catch (error) {
      console.error("Password update error:", error);
      alert("Failed to update password");
    }
  };

  // Download user data (GDPR compliance)
  const handleDownloadData = async () => {
    try {
      const res = await fetch(`http://${ip}:3000/users/${profile._id}/export`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        const data = await res.json();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `petal-perfect-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert("Your data has been downloaded!");
      } else {
        alert("Failed to export data");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. All your data including orders, wishlist, and cart will be permanently deleted."
    );
    
    if (confirmed) {
      const doubleConfirm = window.prompt(
        'Type "DELETE MY ACCOUNT" to confirm account deletion:'
      );
      
      if (doubleConfirm === "DELETE MY ACCOUNT") {
        try {
          const res = await fetch(`http://${ip}:3000/users/${profile._id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email })
          });

          if (res.ok) {
            alert("Your account has been deleted successfully.");
            signOut();
            window.location.href = "/";
          } else {
            const error = await res.json();
            alert(error.message || "Failed to delete account");
          }
        } catch (error) {
          console.error("Delete account error:", error);
          alert("Failed to delete account");
        }
      } else {
        alert("Account deletion cancelled - text didn't match");
      }
    }
  };

  if (loading) return <div className="loading-profile">Loading your profile...</div>;
  if (!profile) return <div className="loading-profile">Profile not found</div>;

  return (
    <>
      <div className="profile-page">
        <h1>My Account 🌸</h1>
        
        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={activeTab === "overview" ? "tab active" : "tab"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={activeTab === "settings" ? "tab active" : "tab"}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog /> Settings
          </button>
          <button 
            className={activeTab === "security" ? "tab active" : "tab"}
            onClick={() => setActiveTab("security")}
          >
            <FaShieldAlt /> Security
          </button>
        </div>

        <div className="profile-main">
          {/* === LEFT PANEL - PERSONAL INFO === */}
          <div className="profile-card">
            <div className="avatar-section">
              <img className="avatar" src={avatarPick || profile.avatar} alt="avatar" />
              <div>
                {editMode ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap:"4px", marginTop:8 }}>
                    {avatarChoices.map((url, i) =>
                      <img
                        src={url}
                        alt={`avatar${i}`}
                        key={i}
                        className="avatar"
                        style={{
                          width: 40, height: 40, border: avatarPick===url? "3px solid #a10061":"1px solid #ccc", cursor:"pointer"
                        }}
                        onClick={() => handleAvatarClick(url)}
                      />
                    )}
                  </div>
                ) : null}
                <h2>{editMode
                  ? <input name="userName" value={editInfo.userName} onChange={handleChange}/>
                  : profile.userName || profile.username}
                </h2>
                <p className="muted">@{profile.username || profile.userName}</p>
              </div>
            </div>
            
            {/* Customer Badge */}
            <div className="customer-badge">
              <span className={`status-badge ${totalSpent > 1000 ? 'badge-vip' : totalSpent > 500 ? 'badge-gold' : totalSpent > 200 ? 'badge-silver' : 'badge-bronze'}`}>
                {totalSpent > 1000 ? 'VIP Customer' : totalSpent > 500 ? 'Gold Member' : totalSpent > 200 ? 'Silver Member' : 'Bronze Member'}
              </span>
            </div>

            <div className="profile-lines">
              <label>Email:</label>
              <span>{profile.email}</span>
            </div>
            <div className="profile-lines">
              <label>Phone:</label>
              {editMode
                ? <input value={editInfo.phone} name="phone" onChange={handleChange} placeholder="Enter phone number" />
                : <span>{profile.phone || "Not provided"}</span>
              }
            </div>
            <div className="profile-lines">
              <label>Address:</label>
              {editMode
                ? <input value={editInfo.address} name="address" onChange={handleChange} placeholder="Enter delivery address" />
                : <span>{profile.address || "Not provided"}</span>
              }
            </div>
            <div className="profile-lines">
              <label>Member Since:</label>
              <span>{new Date(profile.createdAt || user.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="profile-actions">
              {!editMode
                ? <button className="edit-btn" onClick={()=>setEditMode(true)}>Edit Info</button>
                : (
                  <>
                    <button className="save-btn" onClick={handleSave}>Save Changes</button>
                    <button className="edit-btn" style={{marginLeft:10}} onClick={()=>setEditMode(false)}>Cancel</button>
                  </>
                )
              }
            </div>
          </div>

          {/* === RIGHT PANEL - DYNAMIC CONTENT === */}
          <div className="profile-info-right">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <>
                <div className="box-section">
                  <h3>Account Summary</h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-number">{totalOrders}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">R{totalSpent.toFixed(2)}</span>
                      <span className="stat-label">Total Spent</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">{wishlist.length}</span>
                      <span className="stat-label">Wishlist Items</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">{cart.length}</span>
                      <span className="stat-label">Cart Items</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">{topCategory}</span>
                      <span className="stat-label">Favorite Category</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-number">{settings.flowerPreferences.length}</span>
                      <span className="stat-label">Flower Preferences</span>
                    </div>
                  </div>
                </div>

                <div className="box-section">
                  <h3>Recent Orders</h3>
                  {orders.length === 0
                    ? <p>No orders yet. <a href="/category" style={{color: "#a10061"}}>Start shopping!</a></p>
                    : orders.slice(0,3).map(order =>
                      <div className="order-card" key={order._id || order.id}>
                        <div className="order-header">
                          <span><b>ID:</b> {(order._id || order.id)?.toString().slice(-6)}</span>
                          <span><b>Date:</b> {new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                          <span className={`status order-status-${(order.status || 'placed').toLowerCase()}`}>
                            {order.status || 'Placed'}
                          </span>
                        </div>
                        <div className="order-items">
                          {(order.cart||[]).slice(0,4).map((item) => (
                            <div className="order-item" key={item._id || item.id} title={item.title}>
                              <img src={item.image} alt={item.title} />
                              <span>{item.title} <b>x{item.quantity||1}</b></span>
                            </div>
                          ))}
                          {order.cart && order.cart.length > 4 && (
                            <div className="more-items">+{order.cart.length - 4} more</div>
                          )}
                        </div>
                      <div className="order-footer">
  <span>Total: <strong>R{order.total?.toFixed(2) || '0.00'}</strong></span>
  <div className="order-actions">
    <button className="details-btn" onClick={() => setActiveTab("orders")}>
      View Details
    </button>
    <button 
      className="track-btn" 
      onClick={() => window.location.href = `/track-order?order=${(order._id || order.id)?.toString().slice(-6)}`}
    >
      <FaTruck /> Track Order
    </button>
  </div>
</div>
                      </div>
                    )
                  }
                  {orders.length > 3 && (
                    <button className="view-all-btn" onClick={() => setActiveTab("orders")}>
                      View All Orders ({orders.length})
                    </button>
                  )}
                </div>

                <div className="box-section">
                  <h3>Current Wishlist</h3>
                  {wishlist.length === 0
                    ? <p>Your wishlist is empty. <a href="/category" style={{color: "#a10061"}}>Add some flowers!</a></p>
                    : <div className="wishlist-grid">
                        {wishlist.slice(0,6).map(prod =>
                          <div key={prod._id} className="wishlist-card">
                            <img src={prod.image} alt={prod.title} />
                            <span>{prod.title}</span>
                            <span className="wishlist-price">R{prod.price?.toFixed(2)}</span>
                          </div>
                        )}
                        {wishlist.length > 6 && (
                          <div className="more-wishlist">
                            <a href="/wishlist" style={{color: "#a10061"}}>
                              +{wishlist.length - 6} more items
                            </a>
                          </div>
                        )}
                      </div>
                  }
                </div>
              </>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <>
                <div className="box-section">
                  <h3><FaBell /> Notification Preferences</h3>
                  <div className="settings-group">
                    <label className="setting-item">
                      <span>Email Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                      />
                    </label>
                    <label className="setting-item">
                      <span>SMS Notifications</span>
                      <input 
                        type="checkbox" 
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange("smsNotifications", e.target.checked)}
                      />
                    </label>
                    <label className="setting-item">
                      <span>Marketing Emails</span>
                      <input 
                        type="checkbox" 
                        checked={settings.marketingEmails}
                        onChange={(e) => handleSettingChange("marketingEmails", e.target.checked)}
                      />
                    </label>
                    <label className="setting-item">
                      <span>Order Status Updates</span>
                      <input 
                        type="checkbox" 
                        checked={settings.orderUpdates}
                        onChange={(e) => handleSettingChange("orderUpdates", e.target.checked)}
                      />
                    </label>
                    <label className="setting-item">
                      <span>Price Drop Alerts</span>
                      <input 
                        type="checkbox" 
                        checked={settings.priceAlerts}
                        onChange={(e) => handleSettingChange("priceAlerts", e.target.checked)}
                      />
                    </label>
                  </div>
                </div>

                <div className="box-section">
                  <h3><FaTruck /> Delivery Preferences</h3>
                  <div className="settings-group">
                    <label className="setting-item">
                      <span>Preferred Delivery Time</span>
                      <select 
                        value={settings.defaultDeliveryTime}
                        onChange={(e) => handleSettingChange("defaultDeliveryTime", e.target.value)}
                      >
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </label>
                    <label className="setting-item">
                      <span>Auto-Reorder Monthly Favorites</span>
                      <input 
                        type="checkbox" 
                        checked={settings.autoReorder}
                        onChange={(e) => handleSettingChange("autoReorder", e.target.checked)}
                      />
                    </label>
                  </div>
                </div>

                <div className="box-section">
                  <h3><FaHeart /> Flower Preferences</h3>
                  <div className="settings-group">
                    <label className="setting-item-vertical">
                      <span>Favorite Flower Types</span>
                      <div className="flower-checkboxes">
                        {["Roses", "Lilies", "Tulips", "Sunflowers", "Orchids", "Carnations", "Daisies", "Peonies"].map(flower => (
                          <label key={flower} className="checkbox-item">
                            <input 
                              type="checkbox"
                              checked={settings.flowerPreferences.includes(flower)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleSettingChange("flowerPreferences", [...settings.flowerPreferences, flower]);
                                } else {
                                  handleSettingChange("flowerPreferences", settings.flowerPreferences.filter(f => f !== flower));
                                }
                              }}
                            />
                            {flower}
                          </label>
                        ))}
                      </div>
                    </label>
                    <label className="setting-item-vertical">
                      <span>Allergy Information & Special Notes</span>
                      <textarea 
                        placeholder="Any flower allergies, preferences to avoid, or special delivery instructions..."
                        value={settings.allergyInfo}
                        onChange={(e) => handleSettingChange("allergyInfo", e.target.value)}
                        rows="3"
                      />
                    </label>
                    <label className="setting-item">
                      <span>Make My Wishlist Public</span>
                      <input 
                        type="checkbox" 
                        checked={settings.wishlistPublic}
                        onChange={(e) => handleSettingChange("wishlistPublic", e.target.checked)}
                      />
                    </label>
                  </div>
                </div>

                <div className="box-section">
                  <button className="save-settings-btn" onClick={handleSave}>
                    Save All Settings
                  </button>
                </div>
              </>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <>
                <div className="box-section">
                  <h3><FaShieldAlt /> Password & Security</h3>
                  
                  {!showPasswordChange ? (
                    <div className="security-info">
                      <p>Last password change: {profile.lastPasswordChange ? new Date(profile.lastPasswordChange).toLocaleDateString() : "Never"}</p>
                      <button 
                        className="password-btn"
                        onClick={() => setShowPasswordChange(true)}
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                      <div className="password-field">
                        <label>Current Password</label>
                        <input 
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="password-field">
                        <label>New Password</label>
                        <input 
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                      <div className="password-field">
                        <label>Confirm New Password</label>
                        <input 
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="password-actions">
                        <button type="submit" className="save-btn">Update Password</button>
                        <button 
                          type="button" 
                          className="edit-btn"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="box-section">
                  <h3>Data & Privacy</h3>
                  <div className="security-actions">
                    <button className="download-data-btn" onClick={handleDownloadData}>
                      <FaDownload /> Download My Data
                    </button>
                    <p className="privacy-note">
                      Download all your account data including orders, preferences, and personal information.
                    </p>
                  </div>
                </div>

                <div className="box-section danger-zone">
                  <h3>Danger Zone</h3>
                  <div className="security-actions">
                    <button className="delete-account-btn" onClick={handleDeleteAccount}>
                      <FaTrash /> Delete My Account
                    </button>
                    <p className="danger-note">
                      ⚠️ This will permanently delete your account, orders, wishlist, and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* LOGOUT SECTION - Always visible */}
            <div className="box-section logout-sec">
              <button className="logout-btn" onClick={signOut}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;