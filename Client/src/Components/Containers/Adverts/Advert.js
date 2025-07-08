import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CardBody, CardTitle } from '../../text';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Advert = (props) => {
  const history = useHistory();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });

  return (
    <div
      className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
      onClick={() => history.push(`/adverts/${props._id}`)}
    >
      <LazyLoadImage
        className="w-full hover:scale-105"
        effect="blur"
        placeholderSrc="/images/logo.png"
        afterLoad={() => {
          setImageConfiguration({ height: '', width: '' });
        }}
        {...imageConfiguration}
        src={`${process.env.REACT_APP_BACKEND_URL}/images/${props.gallery[0]}`}
        alt={props.gallery[0]}
      />
      <div className="px-6 py-4">
        <CardTitle
          name={props.name[selectedLanguage]}
          additional="font-bold text-xl mb-2"
        />
        <CardBody
          name={props.description[selectedLanguage].replace(
            /(<([^>]+)>)/gi,
            ''
          )}
          additional="text-gray-500 text-base truncate"
        />
      </div>
    </div>
  );
};

export default Advert;
