import React from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import {
  useFetchActivePublicationsIntroQuery,
  useFetchActivePublicationsQuery,
} from '../../features/API/user-api-slice';
import CustomHelmet from '../../components/UI/Helmet';
import Spinner from '../../components/UI/spinner';
import { CardBody, PageTitle } from '../../components/text';
import Publication from '../../components/containers/publications/Publication';
import Wrapper from '../../components/containers/admin/Wrapper';

const AdminPublications = (props) => {
  const {
    data: publicationsIntro = [],
    isFetching: isFetchingPublicationsIntro,
  } = useFetchActivePublicationsIntroQuery();
  const { data: publication = [], isFetching: isFetchingPublications } =
    useFetchActivePublicationsQuery();

  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );

  return (
    <div>
      <CustomHelmet name="PUBLICATIONS" />
      <Header />
      {isFetchingPublicationsIntro ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="publicationsintro">
          <div className="bg-gray-200 py-5">
            <div className="w-90% lg:w-70% m-auto">
              <PageTitle
                name={publicationsIntro.results.title[selectedLanguage]}
                color="red"
                additional="text-center py-5"
              />
              <CardBody
                name={publicationsIntro.results.description[selectedLanguage]}
                additional="text-center"
              />
            </div>
          </div>
        </Wrapper>
      )}
      {isFetchingPublications ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="publications">
          <div className="w-90% lg:w-70% m-auto py-5 grid grid-col-1 md:grid-col-2 lg:grid-cols-3 gap-5">
            {publication.results.map((publication, index) => (
              <Publication key={index} {...publication} />
            ))}
          </div>
        </Wrapper>
      )}
      <Footer />
    </div>
  );
};

export default AdminPublications;
