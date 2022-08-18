import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const LoginForm = (props) => {
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();
  const { t } = useTranslation();
  const { rollbar } = props;

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
    <>
      <div className='container rounded w-50 my-3 p-3 bg-white'>
        <div className='row'>
          <h3>{t('logIn')}</h3>
          <Form onSubmit={f.handleSubmit}>
            <Form.Group className="mb-3" controlId="formLogin">
              <FloatingLabel
                controlId="floatingUsername"
                label={t('loginPlaceholder')}
                className="mb-3"
              >
                <Form.Control
                  type="text"
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
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <FloatingLabel
                controlId="floatingPassword"
                label={t('passwordPlaceholder')}
                className="mb-3"
              >
                <Form.Control
                  id='password'
                  type="text"
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
                {authFailed ? <div className="invalid-tooltip">{t('errors.other.authFailed')}</div> : null}
              </FloatingLabel>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={f.isSubmitting}>
              {t('logIn')}
            </Button>
          </Form>
        </div>
        <div className='row mt-5 p-2 text-center bg-light'>
          <span>{t('promptSignUp')}</span>
          <a href="/signup">{t('registration')}</a>
        </div>
      </div>
    </>
  );
  // END
};

export default LoginForm;