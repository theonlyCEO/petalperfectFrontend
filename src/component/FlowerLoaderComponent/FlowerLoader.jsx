import React from "react";
import "./FlowerLoader.css";

const FlowerLoader = () => (
  <div className="flower-loader-bg">
    <div className="flower-spinner">
      {/* A simple animated flower made of 5 petals */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`petal petal-${i+1}`}></div>
      ))}
      <div className="flower-center"></div>
    </div>
    <div className="flower-loader-text">
      Blooming your flowers...
    </div>
  </div>
);

export default FlowerLoader;