import React from 'react';
import { useSelector } from 'react-redux';
import { useFetchActiveChartsQuery } from '../../../features/API/user-api-slice';
import { PageTitle } from '../../text';
import Spinner from '../../UI/spinner';

const Chart = () => {
  const { data = [], isFetching } = useFetchActiveChartsQuery();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const chart = data.results;
  return isFetching ? (
    <Spinner />
  ) : (
    <div>
      <PageTitle
        name={chart.title[selectedLanguage]}
        color="red"
        alignment="center"
        mobileAlignment="center"
        additional="py-5"
      />
      <div className="w-full md:w-70% m-auto">
        <img
          className="w-full h-auto"
          src={`${process.env.REACT_APP_BACKEND_URL}/images/${chart.image}`}
          alt="organisational chart"
        />
      </div>
    </div>
  );
};

export default Chart;
