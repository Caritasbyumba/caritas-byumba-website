import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const CustomHelmet = ({ name }) => {
  const { t } = useTranslation();
  return (
    <Helmet>
      <title>{t(name)} - CARITAS BYUMBA</title>
    </Helmet>
  );
};

export default CustomHelmet;
