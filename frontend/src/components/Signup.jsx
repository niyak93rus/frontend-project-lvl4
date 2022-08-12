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
import { logIn } from './Login.jsx';

const SignupForm = () => {
  const [signupError, setSignupError] = useState('');
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

  const signUpUser = async (userData) => {
    axios.post('/api/v1/signup', userData).then(() => {
      logIn(userData, navigate, auth);
    }).catch((err) => {
      console.error(err);

      if (err.request.status === 409) {
        const errorName = 'errors.other.existingUsername';
        setSignupError(t(errorName));
        notify(errorName);
      } else {
        const errorName = 'errors.other.unnknownError';
        setSignupError(t(errorName));
        notify(errorName);
      }
      
      rollbar.error(err);
    });
  };

  const f = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: ''
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
        .oneOf([Yup.ref('password'), null], t('errors.passwordConfirmation.oneOf'))
    }),
    onSubmit: (values) => signUpUser(values),
  });

  return (
    <>
      <div className='container w-50'>
        <h2 className='text-center'>{t('registration')}</h2>
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
              isInvalid={f.errors.username || signupError}
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
              isInvalid={f.errors.password || signupError}
              required
            />
            {f.touched.password && f.errors.password && (
              <p className='text-danger'>{f.errors.password}</p>
            )}
            {f.errors.password && <div className="invalid-feedback d-block">{f.errors.password}</div>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPasswordConfirmation">
            <Form.Label>{t('passwordConfirmationLabel')}</Form.Label>
            <Form.Control
              type="password"
              placeholder={t('passwordConfirmationPlaceholder')}
              value={f.values.passwordConfirmation}
              onChange={f.handleChange}
              data-testid="input-passwordConfirmation"
              name="passwordConfirmation"
              isInvalid={f.errors.passwordConfirmation || signupError}
              required
            />
            {f.touched.passwordConfirmation && f.errors.passwordConfirmation && (
              <p className='text-danger'>{f.errors.passwordConfirmation}</p>
            )}
            {f.errors.passwordConfirmation && <div className="invalid-feedback d-block">{f.errors.passwordConfirmation}</div>}
            {signupError && <div className="invalid-feedback d-block">{signupError}</div>}
            {authFailed && <div className="invalid-feedback d-block">{t('errors.other.unnknownError')}</div>}
          </Form.Group>
          <Button variant="primary" type="submit">
            {t('signUp')}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default SignupForm;