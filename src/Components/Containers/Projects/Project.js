import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CardBody, Quotes, SectionTitle } from '../../text';
import Images from './Images';

const Project = (props) => {
  const history = useHistory();
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  return (
    <div
      className={`flex ${
        props.index % 2 === 0
          ? 'md:flex-row md:space-x-10 flex-col'
          : 'md:flex-row-reverse md:space-x-reverse md:space-x-10 flex-col'
      } justify-between items-center py-5 cursor-pointer`}
      onClick={() => history.push(`/projects/${props._id}`)}
    >
      <Images images={props.gallery} />
      <div>
        <SectionTitle name={props.name} color="red" additional="pt-5 md:pt-0" />
        <Quotes>
          <CardBody name={props.smallDescription[selectedLanguage]} />
        </Quotes>
      </div>
    </div>
  );
};

export default Project;
