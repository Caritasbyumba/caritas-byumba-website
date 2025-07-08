import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CardBody, Quotes, SectionTitle } from '../../text';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Partner = (props) => {
  const [imageConfiguration, setImageConfiguration] = useState({
    height: '100%',
    width: '100%',
  });
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  return (
    <div
      className={`flex flex-col ${
        props.index % 2 === 0
          ? 'md:flex-row md:space-x-10'
          : 'md:flex-row-reverse md:space-x-reverse md:space-x-10'
      } justify-between items-center py-5`}
    >
      <div className="w-full md:w-50%">
        <LazyLoadImage
          className="w-full lg:w-1/2 h-full object-cover object-center m-auto"
          effect="blur"
          placeholderSrc="/images/logo.png"
          afterLoad={() => {
            setImageConfiguration({ height: '', width: '' });
          }}
          {...imageConfiguration}
          src={`${process.env.REACT_APP_BACKEND_URL}/images/${props.image}`}
          alt={props.image}
        />
      </div>
      <div className="w-full md:w-50%">
        <SectionTitle
          name={props.name}
          color="red"
          additional="text-center md:text-left py-5"
        />
        <CardBody
          name={props.description[selectedLanguage]}
          additional="py-3"
        />
        <Quotes>
          <CardBody name={props.quote[selectedLanguage]} additional="italic" />
        </Quotes>
      </div>
    </div>
  );
};

export default Partner;
