import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { useFetchActivePartnersQuery } from '../../../Features/API/user-api-slice';
import { PageTitle } from '../../text';
import Spinner from '../../UI/spinner';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Partners = () => {
  const { t, i18n } = useTranslation();
  const { data, isFetching } = useFetchActivePartnersQuery();
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });
  
  // Safety check for partners data
  const partners = data?.results || [];
  
  // Helper function to get localized text
  const getLocalizedText = (textObj, fallback = '') => {
    if (!textObj) return fallback;
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object') {
      const currentLang = i18n.language || 'en';
      return textObj[currentLang] || textObj.en || textObj.fr || textObj.rw || fallback;
    }
    return fallback;
  };
  
  // Custom arrow components
  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 group"
      aria-label="Previous partner"
    >
      <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 group"
      aria-label="Next partner"
    >
      <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  const sliderSettings = {
    dots: true,
    centerMode: true,
    lazyLoad: true,
    swipeToSlide: true,
    infinite: partners.length > 3,
    autoplay: partners.length > 1,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: Math.min(3, partners.length),
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(2, partners.length),
          centerMode: partners.length > 2,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          centerMode: partners.length > 1,
        },
      },
    ],
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full transition-all duration-300 hover:bg-red-500"></div>
    ),
    dotsClass: "slick-dots custom-dots",
  };
  
  if (isFetching) {
    return (
      <div className="py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12">
          <PageTitle
            name={t('Our Partners')}
            color="red"
            alignment="center"
            mobileAlignment="center"
            additional="mb-4"
          />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('Together with our valued partners, we create lasting impact and positive change in communities across Rwanda.')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {partners.length > 0 ? (
          <>
            {/* Partners Slider */}
            <div className="relative mb-12">
              <Slider {...sliderSettings}>
                {partners.map((partner, index) => (
                  <div key={partner.id || index} className="px-4">
                    <div className="group">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 min-h-[320px] flex flex-col border border-gray-100 hover:border-red-200 transform hover:-translate-y-2">
                        {/* Partner Logo */}
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 group-hover:bg-red-50 transition-all duration-300 flex-shrink-0">
                          <LazyLoadImage
                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            effect="blur"
                            placeholderSrc="/images/logo.png"
                            afterLoad={() => {
                              setImageConfiguration({ height: '', width: '' });
                            }}
                            {...imageConfiguration}
                            src={`${process.env.REACT_APP_BACKEND_URL}/images/${partner.image}`}
                            alt={getLocalizedText(partner.name, "Partner logo")}
                          />
                        </div>
                        
                        {/* Partner Name */}
                        {partner.name && (
                          <h3 className="text-xl font-bold text-gray-800 text-center mb-3 group-hover:text-red-600 transition-colors duration-300 flex-shrink-0">
                            {getLocalizedText(partner.name, 'Partner')}
                          </h3>
                        )}
                        
                        {/* Partner description */}
                        {partner.description && (
                          <div className="flex-grow flex items-center">
                            <p className="text-sm text-gray-600 text-center leading-relaxed">
                              {getLocalizedText(partner.description)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Partnership Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="group">
                  <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {partners.length}+
                  </div>
                  <div className="text-gray-600 font-medium">
                    {t('Active Partners')}
                  </div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    15+
                  </div>
                  <div className="text-gray-600 font-medium">
                    {t('Years Experience')}
                  </div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    50K+
                  </div>
                  <div className="text-gray-600 font-medium">
                    {t('Lives Impacted')}
                  </div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                    100%
                  </div>
                  <div className="text-gray-600 font-medium">
                    {t('Commitment')}
                  </div>
                </div>
              </div>
            </div>


          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('No Partners Yet')}
              </h3>
              <p className="text-gray-600">
                {t('No partners available at the moment. Check back soon for updates!')}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-dots {
          bottom: -50px;
        }
        .custom-dots li {
          margin: 0 4px;
        }
        .custom-dots li.slick-active div {
          background-color: #ef4444;
          transform: scale(1.2);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Partners;