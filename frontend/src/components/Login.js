import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const LoginForm = () => {
  const [authState, setAuthState] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const authorizeUser = async (userData) => {
    const getPath = routes.loginPath();
    try {
      const request = await axios.post(getPath, userData);
      const token = request.data;
      window.localStorage.setItem('userId', JSON.stringify(token));
      setAuthState('successful');
      if (!location.state) {
        navigate('/');
      } else {
        auth.logIn();
        navigate(location.state.from.pathname);
      }
    } catch (error) {
      setAuthState('failed');
      throw new Error(`Error: ${error.message}`);
    }
  };

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
    onSubmit: (values) => authorizeUser(values),
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
          isInvalid={f.errors.username || authState === 'failed'}
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
          isInvalid={f.errors.password || authState === 'failed'}
          required
        />
        {f.touched.password && f.errors.password && (
            <p className='text-danger'>{f.errors.password}</p>
          )}
        {authState === 'failed' ? <div className="invalid-feedback d-block">Введен неверный логин или пароль</div> : null}
      </Form.Group>
      <Button variant="primary" type="submit">
        Войти
      </Button>
    </Form>
  );
  // END
};

export default LoginForm;