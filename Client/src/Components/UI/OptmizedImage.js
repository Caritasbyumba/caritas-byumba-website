// components/UI/OptimizedImage.jsx
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getImageUrl } from '../../services/imageService';

const OptimizedImage = ({ imagePath, alt, className, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(imagePath);

  if (!imageUrl || hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  return (
    <LazyLoadImage
      src={imageUrl}
      alt={alt || 'Image'}
      effect="blur"
      onError={() => setHasError(true)}
      className={className}
      placeholderSrc="/images/logo.png"
      {...props}
    />
  );
};

export default OptimizedImage;