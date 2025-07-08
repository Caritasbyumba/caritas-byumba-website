import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { CardTitle } from '../../text';
import Input from '../../UI/input';

const ImageDescriptions = (props) => {
  const { t } = useTranslation();
  const { imageDescriptions } = props;
  return imageDescriptions.map((image, index) => (
    <Fragment key={index}>
      <CardTitle name={`Image name: ${image.name}`} />
      <div className="flex space-x-2 pb-2">
        <Input
          label={t('English Description')}
          elementType="textarea"
          elementConfig={{
            type: 'text',
            placeholder: t('English Description'),
          }}
          value={image.description.en}
          changed={(e) => props.changeImageDescription(e, index, 'en')}
          validation={{ required: true }}
          shouldValidate
          error={t('English Description required')}
        />
        <Input
          label={t('French Description')}
          elementType="textarea"
          elementConfig={{
            type: 'text',
            placeholder: t('French Description'),
          }}
          value={image.description.fr}
          changed={(e) => props.changeImageDescription(e, index, 'fr')}
          validation={{ required: true }}
          shouldValidate
          error={t('French Description required')}
        />
        <Input
          label={t('Kinyarwanda Description')}
          elementType="textarea"
          elementConfig={{
            type: 'text',
            placeholder: t('Kinyarwanda Description'),
          }}
          value={image.description.rw}
          changed={(e) => props.changeImageDescription(e, index, 'rw')}
          validation={{ required: true }}
          shouldValidate
          error={t('Kinyarwanda Description required')}
        />
      </div>
    </Fragment>
  ));
};

export default ImageDescriptions;
