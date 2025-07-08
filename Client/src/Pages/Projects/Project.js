import React, { useState } from 'react';
import Footer from '../../Components/Containers/Footer';
import Header from '../../Components/Containers/Header';
import { useFetchSpecificProjectQuery } from '../../Features/API/user-api-slice';
import { useParams } from 'react-router-dom';
import Spinner from '../../Components/UI/spinner';
import { CardBody, CardSubText, PageTitle } from '../../Components/text';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import CustomHelmet from '../../Components/UI/Helmet';
import parse from 'html-react-parser';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Project = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { data = [], isFetching } = useFetchSpecificProjectQuery(projectId);
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const project = data.results;

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // Fix for ARIA hidden issue - prevent focusable content in hidden slides
    accessibility: true,
    focusOnSelect: false,
  };
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });

  return (
    <div>
      <CustomHelmet name={project?.name || 'PROJECT'} />
      <Header />
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <div className="text-center py-5 bg-gray-200">
            <PageTitle
              name={project.name}
              color="red"
              additional="text-center mx-10"
            />
            <CardSubText
              name={`${t('Started')}: ${new Date(
                project.startDate
              ).toLocaleDateString(selectedLanguage, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} - ${t('Will end')}: ${new Date(
                project.endDate
              ).toLocaleDateString(selectedLanguage, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
              color="red"
              additional="text-center mx-10"
            />
          </div>
          <div className="w-90% lg:w-70% m-auto py-5">
            {/* Solution 1: Use a div wrapper instead of CardBody directly */}
            <div className="text-center">
              {parse(project.description[selectedLanguage])}
            </div>
          </div>
          <div className="w-90% lg:w-70% m-auto mb-10">
            <Slider {...settings}>
              {project.gallery.map((image, index) => (
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
                    // Remove focus capability from images in non-active slides
                    tabIndex={-1}
                  />
                  {project?.imageDescriptions?.length > 0 && 
                    project.imageDescriptions.find(
                      (imageDesc) => imageDesc.name === image
                    )?.description?.[selectedLanguage] && (
                    <CardBody
                      name={
                        project.imageDescriptions.find(
                          (imageDesc) => imageDesc.name === image
                        ).description[selectedLanguage]
                      }
                      color="gray-500"
                      additional="text-xs text-center"
                    />
                  )}
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

export default Project;