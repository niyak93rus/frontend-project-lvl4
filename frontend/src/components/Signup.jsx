import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/index.jsx';

const SignupForm = () => {
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const signUpUser = async (userData) => {
    const { username, password } = userData;
    console.log(username, password);
    axios.post('/api/v1/signup', { username, password }).then((response) => {
      console.log(response.data); // => { token: ..., username: 'newuser' }
      const { token } = response.data;
      localStorage.setItem('userId', JSON.stringify(token));
      auth.logIn();
      navigate('/');
    }).catch((err) => {
      console.error(err);
      err.request.status === 409
        ? setSignupError('Пользователь с таким именем уже существует!')
        : setSignupError('Что-то пошло не так');
    });
  };

  const f = useFormik({
    initialValues:
    {
      username: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Логин должен быть от 3 до 20 символов')
        .max(20, 'Логин должен быть от 3 до 20 символов')
        .required('Логин обязателен!'),
      password: Yup.string()
        .min(6, 'Пароль должен содержать не менее 6 символов')
        .max(20, 'Пароль должен быть меньше 20 символов')
        .required('Пароль обязателен!'),
      passwordConfirmation: Yup.string()
        .required('Введите подтверждение пароля!')
        .oneOf([Yup.ref('password'), null], 'Не совпадает с введенным паролем')
    }),
    onSubmit: (values) => signUpUser(values),
  });

  return (
    <>
      <div className='container w-50'>
        <h2 className='text-center'>Регистрация</h2>
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
              isInvalid={f.errors.username || signupError}
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
              isInvalid={f.errors.password || signupError}
              required
            />
            {f.touched.password && f.errors.password && (
              <p className='text-danger'>{f.errors.password}</p>
            )}
            {f.errors.password && <div className="invalid-feedback d-block">Введен неверный логин или пароль</div>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPasswordConfirmation">
            <Form.Label>Подтверждение пароля</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль еще раз"
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
            {f.errors.passwordConfirmation && <div className="invalid-feedback d-block">Введен неверный логин или пароль</div>}
            {signupError && <div className="invalid-feedback d-block">{signupError}</div>}
          </Form.Group>
          <Button variant="primary" type="submit">
            Зарегистрироваться
          </Button>
        </Form>
      </div>
    </>
  );
  // END
};

export default SignupForm;