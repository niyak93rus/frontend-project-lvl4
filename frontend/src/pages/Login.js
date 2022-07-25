import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';

const ErrorMessagesSchema = Yup.object().shape({
  login: Yup.string()
    .min(2, 'Логин должен быть больше 2 символов')
    .max(20, 'Логин должен быть меньше 20 символов')
    .required('Логин обязателен!'),
  password: Yup.string()
    .min(4, 'Пароль должен быть больше 4 символов')
    .max(20, 'Пароль должен быть меньше 20 символов')
    .required('Пароль обязателен!'),
});

const loginForm = () => (
  <div className="container col-md-4">
    <div className="col justify-content-center">
      <h1>Войти</h1>
      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={ErrorMessagesSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="login"
                className="form-control"
                name="login"
                placeholder="Ваш логин"
                onChange={handleChange}
                value={values.login}
              />
              <div id="loginFeedback" className="form-text text-danger">
                {errors.login && touched.login && errors.login}
              </div>
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                placeholder="Ваш пароль"
                value={values.password}
              />
              <div id="passwordFeedback" className="form-text text-danger">
                {errors.password && touched.password && errors.password}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              Войти
            </button>
          </form>
        )}
      </Formik>
    </div>
  </div>
);

export default loginForm;