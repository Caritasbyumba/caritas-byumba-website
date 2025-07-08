import React, { useEffect, useState } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Images = (props) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { images } = props;
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImage === images.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentImage, images]);

  const mouseEnteredHandler = () => {
    if (currentImage === images.length - 1) {
      setCurrentImage(0);
    } else {
      setCurrentImage(currentImage + 1);
    }
  };

  return (
    <div
      className="w-90% md:w-96 h-52 md:h-72 shrink-0 rounded-sm relative"
      onMouseEnter={mouseEnteredHandler}
    >
      {images.map((image, index) => (
        <img
          key={index}
          className={`absolute w-full h-full ${
            currentImage === index ? 'inset-0 z-10' : 'top-2 left-2 blur-sm'
          } object-cover object-center rounded-sm transition-all`}
          src={`${process.env.REACT_APP_BACKEND_URL}/images/${image}`}
          alt={image}
          loading='lazy'
        />
      ))}
    </div>
  );
};

export default Images;
