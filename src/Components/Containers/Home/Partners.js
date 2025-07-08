import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { useFetchActivePartnersQuery } from '../../Features/API/user-api-slice';
import { CardTitle, PageTitle } from '../text';
import Spinner from '../UI/spinner';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Partners = () => {
  const { t } = useTranslation();
  const { data = [], isFetching } = useFetchActivePartnersQuery();
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });
  var settings = {
    arrows: false,
    dots: false,
    centerMode: true,
    lazyLoad: true,
    swipeToSlide: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return isFetching ? (
    <Spinner />
  ) : (
    <>
      <PageTitle
        name={t('Our Partners')}
        color="red"
        alignment="center"
        mobileAlignment="center"
        additional="py-5"
      />
      <Slider {...settings}>
        {data.results.map((slide, index) => (
          <div key={index} className="py-5">
            <LazyLoadImage
              className="h-40 object-fit object-center m-auto"
              effect="blur"
              placeholderSrc="/images/logo.png"
              afterLoad={() => {
                setImageConfiguration({ height: '', width: '' });
              }}
              {...imageConfiguration}
              src={`${process.env.REACT_APP_BACKEND_URL}/images/${slide.image}`}
              alt=""
            />
            {/* <CardTitle name={slide.name} alignment="center" additional="py-5" /> */}
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Partners;
