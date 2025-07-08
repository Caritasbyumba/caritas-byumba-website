import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchActiveMainProjectsQuery } from '../../../Features/API/user-api-slice';
import { NormalText } from '../../text';
import { useSelector } from 'react-redux';
import { Button } from '../../UI/button';
import Spinner from '../../UI/spinner';
import { useHistory } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MainProjects = () => {
  const { data = [], isFetching } = useFetchActiveMainProjectsQuery();
  const { t } = useTranslation();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });
  const history = useHistory();
  return isFetching ? (
    <Spinner />
  ) : (
    <div className="flex">
      {data.results.map((project, index) => (
        <div key={index} className="w-50% h-25vh md:h-40vh lg:h-50vh relative">
          <LazyLoadImage
            className="w-full h-full object-cover absolute inset-0 z-10"
            effect="blur"
            wrapperClassName='relative h-full w-full'
            placeholderSrc="/images/logo.png"
            afterLoad={() => {
              setImageConfiguration({ height: '', width: '' });
            }}
            {...imageConfiguration}
            src={`${process.env.REACT_APP_BACKEND_URL}/images/${project.gallery[0]}`}
            alt={project.name}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-50 grid place-items-center">
            <div className="lg:w-70% text-center">
              <NormalText
                name={project.name}
                color="white"
                additional="text-xl lg:text-4xl font-bold capitalize"
              />
              <NormalText
                name={project.smallDescription[selectedLanguage]}
                color="white"
                additional="hidden lg:block"
              />
            </div>
            <Button
              name={t('Read More')}
              isSquare
              outline="false"
              color="red"
              clicked={() => {
                history.push(`/projects/${project._id}`);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainProjects;
