import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import { CardBody, SectionTitle } from '../../components/text';
import CustomHelmet from '../../components/UI/Helmet';
import Spinner from '../../components/UI/spinner';
import { useFetchSpecificPublicationQuery } from '../../features/API/user-api-slice';
import parse from 'html-react-parser';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Publication = () => {
  const { publicationId } = useParams();
  const { data = [], isFetching } =
    useFetchSpecificPublicationQuery(publicationId);
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const publication = data.results;

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });

  return (
    <div>
      <CustomHelmet
        name={publication?.title[selectedLanguage] || 'Publication'}
      />
      <Header />
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <div className="text-center py-5 bg-gray-200">
            <SectionTitle
              name={publication.title[selectedLanguage]}
              color="red"
              additional="text-center w-90% lg:w-70% m-auto"
            />
            {/* <CardSubText
              name={`Posted by ${publication.updatedBy.name} on  ${new Date(
                publication.updatedAt
              ).toLocaleDateString(selectedLanguage, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
              color="red"
              additional="text-center mx-10"
            /> */}
          </div>
          <div className="w-90% lg:w-70% m-auto py-5">
            <CardBody
              name={parse(publication.description[selectedLanguage])}
              additional="text-justify"
            />
          </div>
          <div className="w-90% lg:w-70% m-auto mb-10">
            <Slider {...settings}>
              {publication.gallery.map((image, index) => (
                <div key={index} className="">
                  <LazyLoadImage
                    className="h-30vh md:h-50vh lg:h-70vh w-auto m-auto"
                    effect="blur"
                    placeholderSrc="/images/logo.png"
                    afterLoad={() => {
                      setImageConfiguration({ height: '', width: '' });
                    }}
                    {...imageConfiguration}
                    src={`${process.env.REACT_APP_BACKEND_URL}/images/${image}`}
                    alt={image}
                  />
                  {publication?.imageDescriptions.length > 0 ? (
                    <CardBody
                      name={
                        publication.imageDescriptions.find(
                          (imageDesc) => imageDesc.name === image
                        ).description[selectedLanguage]
                      }
                      color="gray-500"
                      additional="text-xs text-center"
                    />
                  ) : null}
                </div>
              ))}
            </Slider>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Publication;
