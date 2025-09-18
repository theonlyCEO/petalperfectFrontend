import React from "react";
import "./FlowerModal.css";

const FlowerModal = ({ product, onClose, addToCart }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="flower-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-image-container">
          <img src={product.image} alt={product.title} />
        </div>
        
        <div className="modal-content-section">
          <h2>{product.title}</h2>
          <div className="modal-details">
            <p><strong>R{product.price}</strong></p>
            <p className="description">{product.description}</p>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerModal;