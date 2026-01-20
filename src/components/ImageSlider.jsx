import { useState, useEffect } from 'react';

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }}></div>;
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Product"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div className="image-slider">
      <div className="slider-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product ${index + 1}`}
            className={`slider-image ${currentIndex === index ? 'active' : ''}`}
          />
        ))}
        {images.length > 1 && (
          <div className="slider-thumb-container">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slider-thumb ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;

