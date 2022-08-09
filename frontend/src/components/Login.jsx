import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

export const authorizeUser = async (userData, setAuthFailed, auth, navigate) => {
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
    }
    throw err;
  }
};

const LoginForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues:
    {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, 'Логин должен быть больше 2 символов')
        .max(20, 'Логин должен быть меньше 20 символов')
        .required('Логин обязателен!'),
      password: Yup.string()
        .min(4, 'Пароль должен быть больше 4 символов')
        .max(20, 'Пароль должен быть меньше 20 символов')
        .required('Пароль обязателен!'),
    }),
    onSubmit: (values) => authorizeUser(values, setAuthFailed, auth, navigate),
  });

  return (
    <Form onSubmit={f.handleSubmit}>
      <Form.Group className="mb-3" controlId="formLogin">
        <Form.Label>Логин</Form.Label>
        <Form.Control
          autoComplete="username"
          type="username"
          placeholder="Введите логин"
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
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          autoComplete="current-password"
          type="password"
          placeholder="Введите пароль"
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
        {authFailed ? <div className="invalid-feedback d-block">Введен неверный логин или пароль</div> : null}
      </Form.Group>
      <Button variant="primary" type="submit">
        Войти
      </Button>
    </Form>
  );
  // END
};

export default LoginForm;