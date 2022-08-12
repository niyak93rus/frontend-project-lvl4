import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

export const authorizeUser = async (userData, setAuthFailed, auth, navigate, notify, rollbar) => {
  setAuthFailed(false);
  const getPath = routes.loginPath();
  try {
    const request = await axios.post(getPath, userData);
    const token = request.data;
    localStorage.setItem('userId', JSON.stringify(token));
    auth.logIn(userData);
    navigate('/');
  } catch (err) {
    if (err.isAxiosError && err.response.status === 401) {
      setAuthFailed(true);
      notify('errors.other.authFailed');
    }
    console.error(err);
    rollbar(err);
  }
};

const LoginForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();
  const { t } = useTranslation();
  const rollbar = useRollbar();
  
  const notify = (message) => toast.error(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, t('errors.username.length'))
        .max(20, t('errors.username.length'))
        .required(t('errors.username.required')),
      password: Yup.string()
        .min(2, t('errors.password.length'))
        .max(20, t('errors.password.length'))
        .required(t('errors.password.required')),
    }),
    onSubmit: (values) => authorizeUser(values, setAuthFailed, auth, navigate, notify, rollbar),
  });

  return (
    <Form onSubmit={f.handleSubmit}>
      <Form.Group className="mb-3" controlId="formLogin">
        <Form.Label>{t('loginLabel')}</Form.Label>
        <Form.Control
          autoComplete="username"
          type="username"
          placeholder={t('loginPlaceholder')}
          onChange={f.handleChange}
          value={f.values.username}
          data-testid="input-username"
          name="username"
          ref={inputRef}
          isInvalid={f.errors.username || authFailed}
          required
        />
        {f.touched.username && f.errors.username && (
          <span className='text-danger'>{f.errors.username}</span>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>{t('passwordLabel')}</Form.Label>
        <Form.Control
          autoComplete="current-password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={f.values.password}
          onChange={f.handleChange}
          data-testid="input-password"
          name="password"
          isInvalid={f.errors.password || authFailed}
          required
        />
        {f.touched.password && f.errors.password && (
          <p className='text-danger'>{f.errors.password}</p>
        )}
        {authFailed ? <div className="invalid-feedback d-block">{t('errors.other.authFailed')}</div> : null}
      </Form.Group>
      <Button variant="primary" type="submit">
        {t('logIn')}
      </Button>
    </Form>
  );
  // END
};

export default LoginForm;