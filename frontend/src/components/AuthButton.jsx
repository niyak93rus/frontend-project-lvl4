import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/index.js';

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation('translation');
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }
  return (auth.user
    ? <Button onClick={auth.logOut}>{t('logOut')}</Button>
    : <Button as={Link} to="/login" state={{ from: location }}>{t('logIn')}</Button>);
};

export default AuthButton;
