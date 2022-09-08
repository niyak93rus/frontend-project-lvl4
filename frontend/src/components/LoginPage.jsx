import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import {
  Button, Form, FloatingLabel, FormControl,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useAuth } from '../contexts/index.js';
import routes from '../routes.js';

const LoginForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const notify = (message) => toast.error(t(`${message}`));

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, 'errors.username.length')
        .max(20, 'errors.username.length')
        .required('errors.username.required'),
      password: Yup.string()
        .min(2, 'errors.password.length')
        .max(20, 'errors.password.length')
        .required('errors.password.required'),
    }),
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        auth.logIn(res.data);
        navigate('/');
      } catch (err) {
        if (!err.isAxiosError) {
          notify('errors.other.unnknownError');
          console.error(err);
          rollbar.error(err);
          return;
        }

        if (err.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          notify('errors.other.axiosError');
          console.error(err);
          rollbar.error(err);
        }
      }
    },
  });

  return (
    <div className="container rounded w-50 my-3 p-3 bg-white">
      <div className="row">
        <h3>{t('logIn')}</h3>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group className="mb-3" controlId="formLogin">
            <FloatingLabel
              label={t('loginPlaceholder')}
              className="mb-3"
              controlId="username"
            >
              <Form.Control
                onChange={f.handleChange}
                value={f.values.username}
                name="username"
                autoComplete="username"
                isInvalid={(f.touched.username && f.errors.username) || authFailed}
                ref={inputRef}
                placeholder={t('loginPlaceholder')}
              />
              {f.touched.username && f.errors.username && (
                <span className="text-danger">{t(f.errors.username)}</span>
              )}
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel label={t('passwordLabel')} controlId="password" className="mb-4">
              <FormControl
                type="password"
                name="password"
                placeholder={t('passwordPlaceholder')}
                autoComplete="current-password"
                value={f.values.password}
                onChange={f.handleChange}
                isInvalid={(f.touched.password && f.errors.password) || authFailed}
              />
              {f.touched.password && f.errors.password && (
                <span className="text-danger">{t(f.errors.password)}</span>
              )}
              <FormControl.Feedback type="invalid" tooltip>{t('errors.other.authFailed')}</FormControl.Feedback>
            </FloatingLabel>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={f.isSubmitting}>
            {t('logIn')}
          </Button>
        </Form>
      </div>
      <div className="row mt-5 p-2 text-center bg-light">
        <span>{t('promptSignUp')}</span>
        <a href="/signup">{t('registration')}</a>
      </div>
    </div>
  );
  // END
};

export default LoginForm;
