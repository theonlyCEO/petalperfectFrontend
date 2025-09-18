import React, { createContext, useState, useEffect, useContext } from "react";
export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Local state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Fetch from backend if logged in
  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  // Fetch user data (cart, wishlist)
  const fetchUserData = async () => {
    if (!user?.email) return;
    
    try {
      setIsLoading(true);
      const [cartRes, wishlistRes] = await Promise.all([
        fetch(`http://localhost:3000/carts?email=${user.email}`),
        fetch(`http://localhost:3000/wishlist?email=${user.email}`)
      ]);
      
      const [cartData, wishlistData] = await Promise.all([
        cartRes.json(),
        wishlistRes.json()
      ]);
      
      setCart(cartData);
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Cart actions
  const addToCart = async (product) => {
    if (!user?.email) return alert("Sign in to add to cart");
    
    try {
      const toSend = { ...product };
      delete toSend._id; // Prevent sending any _id
      
      const res = await fetch("http://localhost:3000/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toSend, email: user.email, quantity: 1 })
      });
      
      if (res.ok) {
        // Refetch cart data
        const cartRes = await fetch(`http://localhost:3000/carts?email=${user.email}`);
        const cartData = await cartRes.json();
        setCart(cartData);
        return { success: true };
      } else {
        const error = await res.json();
        alert(error.message || "Failed to add to cart");
        return { success: false };
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add to cart");
      return { success: false };
    }
  };

  const removeFromCart = async (id) => {
    if (!user?.email) return;
    
    try {
      const res = await fetch(`http://localhost:3000/carts/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        const cartRes = await fetch(`http://localhost:3000/carts?email=${user.email}`);
        const cartData = await cartRes.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      alert("Failed to remove from cart");
    }
  };

  const updateQuantity = async (id, qty) => {
    if (!user?.email || qty < 1) return;
    
    try {
      const res = await fetch(`http://localhost:3000/carts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty })
      });
      
      if (res.ok) {
        const cartRes = await fetch(`http://localhost:3000/carts?email=${user.email}`);
        const cartData = await cartRes.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      alert("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!user?.email) return;
    
    try {
      const res = await fetch(`http://localhost:3000/cart/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      
      if (res.ok) {
        setCart([]);
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      alert("Failed to clear cart");
    }
  };

  // Wishlist actions
  const addToWishlist = async (product) => {
    if (!user?.email) return alert("Sign in to add to wishlist");
    
    try {
      const toSend = { ...product };
      delete toSend._id;
      
      const res = await fetch("http://localhost:3000/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toSend, email: user.email })
      });
      
      if (res.ok) {
        const wishlistRes = await fetch(`http://localhost:3000/wishlist?email=${user.email}`);
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
        alert("Added to wishlist!");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      alert("Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (id) => {
    if (!user?.email) return;
    
    try {
      const res = await fetch(`http://localhost:3000/wishlist/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        const wishlistRes = await fetch(`http://localhost:3000/wishlist?email=${user.email}`);
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData);
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      alert("Failed to remove from wishlist");
    }
  };

  const clearWishlist = async () => {
    if (!user?.email) return;
    
    try {
      // Delete all wishlist items for the user
      for (let item of wishlist) {
        await fetch(`http://localhost:3000/wishlist/${item._id}`, { method: "DELETE" });
      }
      setWishlist([]);
      alert("Wishlist cleared!");
    } catch (error) {
      console.error("Clear wishlist error:", error);
      alert("Failed to clear wishlist");
    }
  };

  const moveAllToCart = async () => {
    if (!user?.email) return;
    
    try {
      for (let item of wishlist) {
        const addResult = await addToCart(item);
        if (addResult?.success) {
          await removeFromWishlist(item._id);
        }
      }
      alert("All items moved to cart!");
    } catch (error) {
      console.error("Move to cart error:", error);
      alert("Failed to move items to cart");
    }
  };

  // User management functions
  const updateProfile = async (profileData) => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(prev => ({ ...prev, ...profileData }));
        return { success: true, data: updatedUser };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "Failed to update profile" };
    }
  };

  // Settings management
  const updateUserSettings = async (settings) => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings })
      });
      
      if (res.ok) {
        setUser(prev => ({ ...prev, settings }));
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Update settings error:", error);
      return { success: false, message: "Failed to update settings" };
    }
  };

  // Password change
  const changePassword = async (currentPassword, newPassword) => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        })
      });
      
      if (res.ok) {
        return { success: true, message: "Password updated successfully" };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, message: "Failed to update password" };
    }
  };

  // Export user data
  const exportUserData = async () => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/export`);
      
      if (res.ok) {
        const data = await res.json();
        return { success: true, data };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Export data error:", error);
      return { success: false, message: "Failed to export data" };
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      
      if (res.ok) {
        signOut(); // Clear local state
        return { success: true, message: "Account deleted successfully" };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, message: "Failed to delete account" };
    }
  };

  // Get user statistics
  const getUserStats = async () => {
    if (!user?.userId && !user?._id) return { success: false, message: "User not logged in" };
    
    const userId = user.userId || user._id;
    
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/stats`);
      
      if (res.ok) {
        const stats = await res.json();
        return { success: true, data: stats };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Get stats error:", error);
      return { success: false, message: "Failed to get statistics" };
    }
  };

  // NEW: Track specific order by ID
  const trackOrder = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`);
      
      if (res.ok) {
        const order = await res.json();
        return { success: true, data: order };
      } else {
        return { success: false, message: "Order not found" };
      }
    } catch (error) {
      console.error("Track order error:", error);
      return { success: false, message: "Failed to track order" };
    }
  };

  // NEW: Get order by partial ID (for user convenience)
  const findOrderByPartialId = async (partialId) => {
    if (!user?.email) return { success: false, message: "User not logged in" };
    
    try {
      const ordersResult = await getUserOrders();
      if (ordersResult.success) {
        const orders = ordersResult.data;
        const foundOrder = orders.find(order => 
          (order._id || order.id)?.toString().includes(partialId) ||
          (order._id || order.id)?.toString().slice(-6) === partialId
        );
        
        if (foundOrder) {
          return { success: true, data: foundOrder };
        } else {
          return { success: false, message: "Order not found in your orders" };
        }
      } else {
        return ordersResult;
      }
    } catch (error) {
      console.error("Find order error:", error);
      return { success: false, message: "Failed to find order" };
    }
  };

  // Enhanced sign out
  const signOut = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
  };

  // Place order
  const placeOrder = async (orderData) => {
    if (!user?.email) return { success: false, message: "User not logged in" };
    
    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          email: user.email,
          cart: cart,
          createdAt: new Date(),
          status: "placed" // Ensure initial status
        })
      });
      
      if (res.ok) {
        const result = await res.json();
        // Clear cart after successful order
        await clearCart();
        return { success: true, data: result };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Place order error:", error);
      return { success: false, message: "Failed to place order" };
    }
  };

  // Get user orders
  const getUserOrders = async () => {
    if (!user?.email) return { success: false, message: "User not logged in" };
    
    try {
      const res = await fetch(`http://localhost:3000/orders?email=${user.email}`);
      
      if (res.ok) {
        const orders = await res.json();
        return { success: true, data: orders };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Get orders error:", error);
      return { success: false, message: "Failed to get orders" };
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId || item.id === productId);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart.some(item => item._id === productId || item.id === productId);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Context value with all functions and state
  const contextValue = {
    // State
    cart,
    wishlist,
    user,
    isLoading,

    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Wishlist actions
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveAllToCart,

    // User management
    setUser,
    signOut,
    updateProfile,
    updateUserSettings,
    changePassword,
    exportUserData,
    deleteAccount,

    // Data fetching
    fetchUserData,
    getUserStats,
    getUserOrders,
    placeOrder,

    // NEW: Order tracking
    trackOrder,
    findOrderByPartialId,

    // Utility functions
    isInWishlist,
    isInCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hooks for easier usage
export const useCart = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useCart must be used within ShopProvider");
  }
  return {
    cart: context.cart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    getCartTotal: context.getCartTotal,
    getCartItemCount: context.getCartItemCount,
    isInCart: context.isInCart
  };
};

export const useWishlist = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useWishlist must be used within ShopProvider");
  }
  return {
    wishlist: context.wishlist,
    addToWishlist: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
    clearWishlist: context.clearWishlist,
    moveAllToCart: context.moveAllToCart,
    isInWishlist: context.isInWishlist
  };
};

export const useAuth = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useAuth must be used within ShopProvider");
  }
  return {
    user: context.user,
    setUser: context.setUser,
    signOut: context.signOut,
    updateProfile: context.updateProfile,
    updateUserSettings: context.updateUserSettings,
    changePassword: context.changePassword,
    exportUserData: context.exportUserData,
    deleteAccount: context.deleteAccount,
    getUserStats: context.getUserStats,
    getUserOrders: context.getUserOrders
  };
};

// NEW: Order tracking hook
export const useOrderTracking = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useOrderTracking must be used within ShopProvider");
  }
  return {
    trackOrder: context.trackOrder,
    findOrderByPartialId: context.findOrderByPartialId,
    getUserOrders: context.getUserOrders
  };
};