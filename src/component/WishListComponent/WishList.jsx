import React, { useContext, useState } from "react";
import "./Wishlist.css";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import FlowerModal from "../FlowerModalComponent/FlowerModal"

const sortOptions = [
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
  { label: "Price Low-High", value: "pricelow" },
  { label: "Price High-Low", value: "pricehigh" }
];

const getSortedWishlist = (wishlist, order) => {
  const clone = [...wishlist];
  switch (order) {
    case "az": return clone.sort((a, b) => a.title.localeCompare(b.title));
    case "za": return clone.sort((a, b) => b.title.localeCompare(a.title));
    case "pricelow": return clone.sort((a, b) => a.price - b.price);
    case "pricehigh": return clone.sort((a, b) => b.price - a.price);
    default: return wishlist;
  }
};

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" style={{marginRight: 3, verticalAlign:'middle'}}><polygon fill="#ffbb00" stroke="#e5ab08" strokeWidth="0.7" points="10,2.5 12.6,7.7 18.2,8.2 14.1,12.1 15.3,17.5 10,14.6 4.7,17.5 5.9,12.1 1.8,8.2 7.4,7.7" /></svg>
);

const WishlistPage = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
    clearWishlist,
    moveAllToCart,
  } = useContext(ShopContext);

  const [sortOrder, setSortOrder] = useState("az");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sortedWishlist = getSortedWishlist(wishlist, sortOrder);

  return (
    <>
    
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h2 className="wishlist-title">My Wishlist</h2>
          {wishlist.length > 0 && (
            <div className="wishlist-header-right">
              <div className="wishlist-sortbar">
                <label htmlFor="wishlist-sort">Order by:</label>
                <select
                  name="wishlist-sort"
                  id="wishlist-sort"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                >
                  {sortOptions.map(opt => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="wishlist-actionsbar">
                <button onClick={moveAllToCart}>Move All to Cart</button>
                <button className="danger" onClick={clearWishlist}>
                  Clear Wishlist
                </button>
              </div>
            </div>
          )}
        </div>
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/heart-3521693-2945050.png?f=webp"
              alt="Empty Wishlist"
            />
            <p>Your wishlist is empty! Add some products you love <span role="img" aria-label="love">❤️</span></p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {sortedWishlist.map((item) => (
              <div key={item._id} className="wishlist-card">
                <div className="wishlist-img-wrap">
                  <img src={item.image} alt={item.title} />
                  <span className={`stock-badge ${item.inStock ? "in" : "out"}`}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="wishlist-main-info">
                  <h3 title={item.title}>{item.title}</h3>
                  <div className="wishlist-rating-price">
                    <span className="wishlist-rating">
                      <StarIcon />
                      <span style={{verticalAlign:'middle'}}>{item.rating || "N/A"}</span>
                    </span>
                    <span className="wishlist-price">
                      R{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="wishlist-actions">
                  <button
                    disabled={!item.inStock}
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="view-link"
                    onClick={() => setSelectedProduct(item)}
                  >
                    View More
                  </button>
                  <button
                    className="remove"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FlowerModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
      />
      
    </>
  );
};

export default WishlistPage;