import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Departments from '../../components/containers/aboutus/Departments';
import Services from '../../components/containers/aboutus/Services';
import Wrapper from '../../components/containers/admin/Wrapper';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import { CardBody, CardTitle, PageTitle, Quotes } from '../../components/text';
import CustomHelmet from '../../components/UI/Helmet';
import Spinner from '../../components/UI/spinner';
import {
  useFetchActiveAboutusQuery,
  useFetchActiveQuotesQuery,
} from '../../features/API/user-api-slice';

const AdminAboutus = (props) => {
  const { t } = useTranslation();
  const { data = [], isFetching } = useFetchActiveAboutusQuery();
  const { data: quotesData = [], isFetching: isQuotesFetching } =
    useFetchActiveQuotesQuery();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const aboutus = data.results;
  const quotes = quotesData.results;

  return (
    <div>
      <CustomHelmet name="WHO WE ARE" />
      <Header />
      {isFetching ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="aboutus">
          <div className="w-70% m-auto">
            <PageTitle
              name={aboutus.name[selectedLanguage]}
              color="red"
              alignment="center"
              mobileAlignment="center"
              additional="py-5"
            />
            <CardBody
              name={aboutus.description[selectedLanguage]}
              alignment="center"
            />
          </div>
          <div className="flex flex-col lg:flex-row justify-between divide-y divide-x-0 lg:divide-x lg:divide-y-0 divide-gray-200 py-5">
            <div className="lg:w-1/3 text-center">
              <CardTitle name={t('Vision')} color="red" alignment="center" />
              <CardBody
                name={aboutus.vision[selectedLanguage]}
                additional="p-5"
              />
            </div>
            <div className="lg:w-1/3 text-center">
              <CardTitle name={t('Mission')} color="red" alignment="center" />
              <CardBody
                name={aboutus.mission[selectedLanguage]}
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
                name={aboutus.objectives[selectedLanguage]}
                additional="p-5"
              />
            </div>
          </div>
        </Wrapper>
      )}
      {isQuotesFetching ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="quotes">
          <div className="w-90% lg:w-70% m-auto">
            {quotes.map((quote, index) => (
              <Fragment key={index}>
                <CardTitle
                  name={quote.role[selectedLanguage]}
                  color="red"
                  additional="text-center"
                />
                <div className="flex flex-col lg:flex-row lg:space-x-10 items-center py-5">
                  <div className="w-40 h-40 shrink-0">
                    <img
                      className="w-full h-full object-cover object-center rounded-full"
                      src={`${process.env.REACT_APP_BACKEND_URL}/images/${quote.profile}`}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <CardTitle
                      name={quote.name}
                      additional="text-center lg:text-left"
                    />
                    <Quotes>
                      <CardBody
                        name={quote.quote[selectedLanguage]}
                        additional="italic"
                      />
                    </Quotes>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </Wrapper>
      )}
      <Wrapper {...props} item="departments">
        <Departments />
      </Wrapper>
      <Wrapper {...props} item="services">
        <Services />
      </Wrapper>
      <Footer />
    </div>
  );
};

export default AdminAboutus;
