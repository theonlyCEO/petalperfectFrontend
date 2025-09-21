import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const FlowerPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchFlower = async () => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchFlower();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="flower-detail-page">
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} />
      <p><strong>Price:</strong> R{product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>
      {/* Add more details and styling as you like */}
    </div>
  );
};

export default FlowerPage;