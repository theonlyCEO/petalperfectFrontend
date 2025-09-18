import { useNavigate } from "react-router-dom";
// ...

const navigate = useNavigate();

// Inside your map for products:
<div
  key={product._id}
  className="category-card"
  onClick={() => navigate(`/product/${product._id}`)} // <-- Navigate to detail page
>
  <div className="product-image-container">
    <img src={product.image} alt={product.title} />
    <div className="product-badges">
      {(product.stock || 10) === 0 ? (
        <span className="badge out-of-stock">Out of Stock</span>
      ) : (product.stock || 10) <= 5 ? (
        <span className="badge low-stock">Low Stock</span>
      ) : null}
      {product.isNew && <span className="badge new">New</span>}
    </div>

    {/* Quick View button stays the same */}
    <button 
      className="quick-view-btn"
      onClick={(e) => {
        e.stopPropagation(); // Prevent navigation
        setModalProduct(product); // Open quick view
      }}
    >
      <FaEye /> Quick View
    </button>
  </div>

  {/* ...rest of card info */}
</div>
