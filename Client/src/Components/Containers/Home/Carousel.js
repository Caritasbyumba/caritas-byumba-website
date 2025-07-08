import React, { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useFetchActiveCarouselQuery } from '../../../Features/API/user-api-slice';
import Slider from 'react-slick';
import { CardBody, NormalText } from '../../text';
import { useSelector } from 'react-redux';
import Spinner from '../../UI/spinner';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Carousel = () => {
  const { data = { results: [] }, isFetching, error } = useFetchActiveCarouselQuery();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const sliderRef = useRef(null);
  const selectedLanguage = useSelector((state) => state.global.selectedLanguage || 'en');
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  // Enhanced logging for debugging
  useEffect(() => {
    if (data?.results?.length > 0) {
      console.log('Carousel data loaded:', data.results.length, 'slides');
      console.log('Backend URL:', backendUrl);
      
      // Log details of each slide for debugging
      data.results.forEach((slide, index) => {
        console.log(`Slide ${index + 1}:`, {
          id: slide.id || slide._id,
          title: slide.title?.en,
          imagePath: slide.image,
          fullImageUrl: `${backendUrl}/images/${slide.image}`
        });
      });
    }
    if (error) {
      console.error('Error fetching carousel data:', error);
    }
  }, [data, error, backendUrl]);

  const handleImageError = (index, slide) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    console.error(`Failed to load image ${index}:`, {
      imageFile: slide.image,
      fullPath: `${backendUrl}/images/${slide.image}`,
      slideInfo: slide.title
    });
    
    // Try to verify if the image file exists by making a HEAD request
    fetch(`${backendUrl}/images/${slide.image}`, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.error(`Image file not found on server: ${slide.image}`, 
            `Status: ${response.status}`);
        }
      })
      .catch(err => {
        console.error(`Network error checking image: ${err.message}`);
      });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => sliderRef.current?.slickNext(),
    onSwipedRight: () => sliderRef.current?.slickPrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Fix: Proper keyboard navigation without using tabIndex on slides
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      sliderRef.current?.slickNext();
    } else if (e.key === 'ArrowLeft') {
      sliderRef.current?.slickPrev();
    }
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (prev, next) => setCurrentSlide(next),
    accessibility: true,
    customPaging: (i) => (
      <button
        aria-label={`Go to slide ${i + 1}`}
        className={`w-6 h-2 mx-1 ${i === currentSlide ? 'bg-red-600' : 'bg-gray-200'}`}
      />
    ),
  };

  // Filter out carousel items with missing or invalid data
  const validCarouselItems = data?.results?.filter(slide => 
    slide && slide.image && slide.title && 
    (slide.title.en || slide.title.fr || slide.title.rw)
  ) || [];

  if (isFetching) return <Spinner />;
  if (error) return <div className="text-center py-12">Failed to load carousel. Please try again later.</div>;
  if (!validCarouselItems.length) return <div className="text-center py-12">No slides available.</div>;

  return (
    // Fix: Make the container focusable once, instead of each slide
    <div 
      {...handlers} 
      className="relative outline-none" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image Carousel"
    >
      <Slider {...settings} ref={sliderRef}>
        {validCarouselItems.map((slide, index) => {
          // URL encode the image path to handle spaces and special characters
          const imageUrl = slide.image 
            ? `${backendUrl}/images/${encodeURIComponent(slide.image)}` 
            : null;
          
          return (
            <div
              key={slide.id || index}
              className="relative h-[30rem] md:h-[40rem] lg:h-[50rem]"
              // Fix: Remove tabIndex from individual slides
            >
              {imageUrl ? (
                <>
                  <LazyLoadImage
                    className="w-full h-full object-cover object-center"
                    src={imageUrl}
                    alt={slide.title?.[selectedLanguage] || 'Carousel slide'}
                    effect="blur"
                    wrapperClassName="w-full h-full"
                    placeholderSrc="/images/placeholder.jpg"
                    threshold={300}
                    onError={() => handleImageError(index, slide)}
                  />
                  {imageErrors[index] && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Image could not be loaded</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}

              <div className="absolute z-10 inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center w-4/5 lg:w-3/4 xl:w-2/3">
                  <NormalText
                    name={slide.title?.[selectedLanguage] || ''}
                    color="white"
                    alignment="center"
                    additional="text-2xl md:text-3xl lg:text-5xl font-semibold uppercase"
                  />
                  <CardBody
                    name={slide.description?.[selectedLanguage] || ''}
                    color="white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;