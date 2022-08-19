import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NoMatch = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('pageNotFound')}</h1>
      <Link to="/">{t('backToMain')}</Link>
    </div>
  );
};

export default NoMatch;
