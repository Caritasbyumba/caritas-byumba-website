import React, { useState } from 'react';
import { useFetchActiveCarouselQuery } from '../../../features/API/user-api-slice';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { CardBody, NormalText } from '../../text';
import { useSelector } from 'react-redux';
import Spinner from '../../UI/spinner';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Carousel = () => {
  const { data = [], isFetching } = useFetchActiveCarouselQuery();
  const [currentSlide, setCurrentSlide] = useState(1);
  let settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 10000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (prev, next) => {
      setCurrentSlide(next);
    },
    customPaging: (i) => (
      <div
        className={`w-6 h-2 hover:bg-red ${
          i === currentSlide ? 'bg-red' : 'bg-gray-200'
        }`}
      ></div>
    ),
  };
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  return isFetching ? (
    <Spinner />
  ) : (
    <Slider {...settings}>
      {data.results.map((slide, index) => (
        <div key={index} className="relative h-30vh md:h-50vh lg:h-80vh">
          <img
            className="w-full h-full object-cover object-center"
            src={`${process.env.REACT_APP_BACKEND_URL}/images/${slide.image}`}
            alt={slide.title[selectedLanguage]}
            loading='lazy'
          />
          <div className="absolute z-10 inset-0 bg-black bg-opacity-40 grid place-items-center">
            <div className="text-center w-70%">
              <NormalText
                name={slide.title[selectedLanguage]}
                color="white"
                alignment="center"
                additional="text-2xl md:text-3xl lg:text-5xl font-semibold uppercase"
              />
              <CardBody
                name={slide.description[selectedLanguage]}
                color="white"
              />
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
