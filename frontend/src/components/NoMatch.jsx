import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import notFound from '../assets/notFound.png';

const NoMatch = () => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column ">
      <h1 className="text-center">{t('pageNotFound')}</h1>
      <div className="text-center">
        <img src={notFound} alt="404" width={400} />
      </div>
      <div className="row mt-2 p-2 text-center bg-light align-items-stretch">
        <Link to="/">{t('backToMain')}</Link>
      </div>
    </div>
  );
};

export default NoMatch;
