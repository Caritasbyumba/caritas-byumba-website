import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CardBody, CardTitle } from '../../text';
import { TextButton } from '../../UI/button';

const DonationArea = (props) => {
  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );
  const { t } = useTranslation();

  return (
    <div
      className={`block p-3 max-w-sm bg-white rounded-lg ${
        props.isChosen ? 'border-2 border-red' : 'border border-gray-200'
      } shadow-md hover:bg-gray-100 cursor-pointer`}
      onClick={props.onClick}
    >
      <CardTitle name={props.name[selectedLanguage]} />
      <CardBody name={props.description[selectedLanguage]} />
      {props.projects.length > 0 && (
        <CardBody name={t('Related projects')} color="red" />
      )}
      {props.projects.map((project) => (
        <TextButton
          name={project.name}
          color="red"
          additional="hover:underline h-fit text-left"
          onClick={() => props.history.push(`/projects/${project._id}`)}
        />
      ))}
    </div>
  );
};

export default DonationArea;
