import React, { useState, useEffect } from "react";
import "Slideshow.css";

const Slideshow = () => {
  const images = [
    "https://via.placeholder.com/1200x400?text=Slide+1",
    "https://via.placeholder.com/1200x400?text=Slide+2",
    "https://via.placeholder.com/1200x400?text=Slide+3",
    "https://via.placeholder.com/1200x400?text=Slide+4",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="slideshow-container">
      <div
        className="slideshow"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div className="slide" key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;