import 'bootstrap';
import axios from 'axios';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import Rollbar from 'rollbar';
import { Provider } from '@rollbar/react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import '../App.css';

import routes from '../routes.js';
import NoMatch from './NoMatch';
import LoginPage from './Login.jsx';
import MainPage from './MainPage';
import SignupPage from './Signup.jsx';

export const authorizeUser = async (userData) => {
  const getPath = routes.loginPath();
  const request = await axios.post(getPath, userData);
  const token = request.data;
  localStorage.setItem('userId', JSON.stringify(token));
  // finish: add error handling
}

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = (userData) => {
    try {
      authorizeUser(userData);
      if (localStorage.getItem('userId')) {
        setLoggedIn(true);
      }
    } catch (err) {
      setLoggedIn(false);
      console.error(err);
    }
  }

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation('translation');
  const location = useLocation();

  if (location.pathname === '/login') return;

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('logOut')}</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>{t('logIn')}</Button>
  );
};

const App = () => {
  const rollbar = new Rollbar({
    accessToken: 'b7ea9e3bca2941aa8f4360689f5480e0',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  });

  return (
    <Provider instance={rollbar}>
        <AuthProvider>
          <Router>
            <Navbar bg="light" expand="lg" className='align-items-stretch justify-content-between'>
              <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
              <AuthButton />
            </Navbar>

            <div className="container p-3 mt-3 h-100 w-100 bg-light">
              <Routes>
                <Route
                  path="/"
                  element={(
                    <MainRoute>
                      <MainPage />
                    </MainRoute>
                  )}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<NoMatch />} />

              </Routes>
            </div>
            <ToastContainer />

          </Router>
        </AuthProvider>
    </Provider>
  )
};

export default App;
