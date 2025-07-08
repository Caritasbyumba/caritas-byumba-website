import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchActiveAboutusQuery } from '../../../Features/API/user-api-slice';
import { CardBody, CardTitle, PageTitle } from '../../text';
import Spinner from '../../UI/spinner';

const Aboutus = () => {
  const { t } = useTranslation();
  const { data = [], isFetching } = useFetchActiveAboutusQuery();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const aboutus = data.results;
  return isFetching ? (
    <Spinner />
  ) : (
    <div className="bg-gray-100">
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
          <CardBody name={aboutus.vision[selectedLanguage]} additional="p-5" />
        </div>
        <div className="lg:w-1/3 text-center">
          <CardTitle name={t('Mission')} color="red" alignment="center" />
          <CardBody name={aboutus.mission[selectedLanguage]} additional="p-5" />
        </div>
        <div className="lg:w-1/3 text-center">
          <CardTitle name={t('Objectives')} color="red" alignment="center" />
          <CardBody
            name={aboutus.objectives[selectedLanguage]}
            additional="p-5"
          />
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
