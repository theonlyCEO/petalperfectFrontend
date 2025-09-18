import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { FaShoppingCart, FaHeart, FaStar, FaTimes } from "react-icons/fa";
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Fetch main product
      const res = await fetch(`http://localhost:3000/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);

      // Fetch related products
      const relatedRes = await fetch(`http://localhost:3000/products?category=${data.category}`);
      if (relatedRes.ok) {
        let relatedData = await relatedRes.json();
        // Filter out the current product
        relatedData = relatedData.filter(item => item._id !== id);
        
        // Shuffle the array
        relatedData.sort(() => Math.random() - 0.5);

        // Take 4 random products
        setRelatedProducts(relatedData.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [id]);


  if (loading) return <div className="text-center">Loading product...</div>;
  if (!product) return <div className="text-center">Product not found.</div>;

  return (
    <div className="product-detail-container">
      {/* Product Top Section */}
      <div className="product-top">
        <div className="product-image-container" onClick={() => setShowModal(true)}>
          <img src={product.image} alt={product.title} className="product-image" />
          <span className="zoom-text">Click to Zoom 🔍</span>
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="price">R{product.price.toFixed(2)}</p>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(product.rating || 4) ? 'star-filled' : 'star-empty'}
              />
            ))}
            <span>({product.rating || 4.0} / 5)</span>
          </div>
          <p className={`stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
          <div className="button-group">
            <button className="button cart" onClick={() => addToCart(product)} disabled={product.stock === 0}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="button wishlist" onClick={() => addToWishlist(product)}>
              <FaHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <div key={item._id} className="related-product-card" onClick={() => window.location.href = `/product/${item._id}`}>
                <img src={item.image} alt={item.title} className="related-product-image" />
                <p className="title">{item.title}</p>
                <p className="price">R{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Zoomed Image */}
      {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
          <span className="close-modal"><FaTimes /></span>
          <img src={product.image} alt={product.title} className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;