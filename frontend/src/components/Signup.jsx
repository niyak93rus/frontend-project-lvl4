import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useAuth } from '../contexts/index.js';
import routes from '../routes.js';

const SignupForm = () => {
  const [signupError, setSignupError] = useState('');
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const notify = (message) => toast.error(t(`${message}`));

  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, t('errors.username.length'))
        .max(20, t('errors.username.length'))
        .required(t('errors.username.required')),
      password: Yup.string()
        .min(6, t('errors.password.length'))
        .max(20, t('errors.password.length'))
        .required(t('errors.password.required')),
      passwordConfirmation: Yup.string()
        .required(t('errors.passwordConfirmation.required'))
        .oneOf([Yup.ref('password'), null], t('errors.passwordConfirmation.oneOf')),
    }),
    onSubmit: async (values) => {
      setRegistrationFailed(false);

      try {
        const res = await axios.post(
          routes.signupPath(),
          { username: values.username, password: values.password },
        );
        auth.logIn(res.data);
        navigate('/');
      } catch (err) {
        rollbar.error(err);
        if (!err.isAxiosError) {
          const errorName = 'errors.other.unnknownError';
          setSignupError(t(errorName));
          notify(errorName);
          throw err;
        }

        if (err.response.status === 409) {
          const errorName = 'errors.other.existingUsername';
          setSignupError(t(errorName));
          notify(errorName);
          setRegistrationFailed(true);
          inputRef.current.select();
          return;
        }

        throw err;
      }
    },
  });

  return (
    <>
      <div className="container rounded w-50 my-3 p-3 bg-light">
        <h2 className="text-center">{t('registration')}</h2>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group className="mb-4 position-relative" controlId="formLogin">
            <FloatingLabel
              controlId="floatingUsername"
              label={t('registrationUserName')}
              className="mb-3"
            >
              <Form.Control
                autoComplete="username"
                type="text"
                placeholder={t('registrationUserName')}
                onChange={f.handleChange}
                value={f.values.username}
                data-testid="input-username"
                name="username"
                ref={inputRef}
                isInvalid={(f.touched.username && f.errors.username) || registrationFailed}
              />
              {f.touched.username && f.errors.username && <div className="invalid-tooltip">{f.errors.username}</div>}
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-4 position-relative" controlId="formPassword">
            <FloatingLabel
              controlId="floatingPassword"
              label={t('passwordPlaceholder')}
              className="mb-3"
            >
              <Form.Control
                autoComplete="current-password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={f.values.password}
                onChange={f.handleChange}
                data-testid="input-password"
                name="password"
                isInvalid={(f.touched.password && f.errors.password) || registrationFailed}
              />
              {f.touched.password && f.errors.password && <div className="invalid-tooltip d-block">{f.errors.password}</div>}
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-4 position-relative" controlId="formPasswordConfirmation">
            <FloatingLabel
              controlId="floatingPasswordConfirmation"
              label={t('passwordConfirmationPlaceholder')}
              className="mb-3"
            >
              <Form.Control
                type="password"
                placeholder={t('passwordConfirmationPlaceholder')}
                value={f.values.passwordConfirmation}
                onChange={f.handleChange}
                data-testid="input-passwordConfirmation"
                name="passwordConfirmation"
                isInvalid={(f.touched.passwordConfirmation && f.errors.passwordConfirmation)
                  || signupError}
              />
              {f.touched.passwordConfirmation && f.errors.passwordConfirmation
                && (
                  <div className="invalid-tooltip d-block">
                    {f.errors.passwordConfirmation}
                  </div>
                )}
              {registrationFailed && <div className="invalid-feedback d-block">{signupError}</div>}
            </FloatingLabel>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={f.isSubmitting}>
            {t('signUp')}
          </Button>
        </Form>
      </div>
      <div className="row mt-5 p-2 text-center bg-light">
        <span>{t('promptLogin')}</span>
        <a href="/login">{t('logIn')}</a>
      </div>
    </>
  );
};

export default SignupForm;
