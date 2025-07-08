import React from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../Components/Containers/Footer';
import Header from '../../Components/Containers/Header';
import {
  useFetchActivePublicationsIntroQuery,
  useFetchActivePublicationsQuery,
} from '../../Features/API/user-api-slice';
import CustomHelmet from '../../Components/UI/Helmet';
import Spinner from '../../Components/UI/spinner';
import { CardBody, PageTitle } from '../../Components/text';
import Publication from '../../Components/Containers/Publications/Publication';
import Wrapper from '../../Components/Containers/Admin/Wrapper';

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
