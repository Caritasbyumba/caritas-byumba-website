import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next'; 
import { useSelector } from 'react-redux'; 
import { useFetchActiveAboutusQuery } from '../../Features/API/user-api-slice';
import Wrapper from '../../Components/Containers/Admin/Wrapper';
import Footer from '../../Components/Containers/Footer';
import Header from '../../Components/Containers/Header';
import Carousel from '../../Components/Containers/Home/Carousel';
import MainProjects from '../../Components/Containers/Home/MainProjects';
import Moreonus from '../../Components/Containers/Home/Moreonus';
import Partners from '../../Components/Containers/Home/Partners';
import Spinner from '../../Components/UI/spinner'; 
import { PageTitle, CardTitle, CardBody } from '../../Components/text'; 

const AdminHome = (props) => {
  const { t } = useTranslation();
  const { data = { results: {} }, isFetching } = useFetchActiveAboutusQuery();
  const aboutus = data.results || {};
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage || 'en'
  );

  return (
    <div>
      <Helmet>
        <title>CARITAS BYUMBA</title>
      </Helmet>
      <Header />
      <Wrapper {...props} item="carousels">
        <div className="focus:outline-none" tabIndex={-1}>
         <Carousel />
        </div>
      </Wrapper>
      {isFetching ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="aboutus">
          <div className="w-70% m-auto">
            <PageTitle
              name={aboutus.name?.[selectedLanguage] || ''}
              color="red"
              alignment="center"
              mobileAlignment="center"
              additional="py-5"
            />
            <CardBody
              name={aboutus.description?.[selectedLanguage] || ''}
              alignment="center"
            />
          </div>
          <div className="flex flex-col lg:flex-row justify-between divide-y divide-x-0 lg:divide-x lg:divide-y-0 divide-gray-200 py-5">
            <div className="lg:w-1/3 text-center">
              <CardTitle name={t('Vision')} color="red" alignment="center" />
              <CardBody
                name={aboutus.vision?.[selectedLanguage] || ''}
                additional="p-5"
              />
            </div>
            <div className="lg:w-1/3 text-center">
              <CardTitle name={t('Mission')} color="red" alignment="center" />
              <CardBody
                name={aboutus.mission?.[selectedLanguage] || ''}
                additional="p-5"
              />
            </div>
            <div className="lg:w-1/3 text-center">
              <CardTitle
                name={t('Objectives')}
                color="red"
                alignment="center"
              />
              <CardBody
                name={aboutus.objectives?.[selectedLanguage] || ''}
                additional="p-5"
              />
            </div>
          </div>
        </Wrapper>
      )}
      <Wrapper {...props} item="more-on-us">
        <Moreonus />
      </Wrapper>
      <Wrapper {...props} item="projects">
        <MainProjects />
      </Wrapper>
      <Wrapper {...props} item="partners">
        <Partners />
      </Wrapper>
      <Footer />
    </div>
  );
};

export default AdminHome;