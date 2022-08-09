import 'bootstrap';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import '../App.css';

import NoMatch from './NoMatch';
import LoginPage from './Login.jsx';
import MainPage from './MainPage';
import SignupPage from './Signup.jsx';

export const checkAuthorization = () => {
  if (localStorage.getItem('userId')) {
    return true;
  }
  return false;
}

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  const logIn = ({username, password}) => {
    setUserData({username, password});
  }
  const logOut = () => {
    localStorage.removeItem('userId');
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ userData, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.userData ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation('translation');
  const location = useLocation();

  return (
    auth.userData
      ? <Button onClick={auth.logOut}>{t('logOut')}</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>{t('logIn')}</Button>
  );
};

const App = () => {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">{t('mainPage')}</Nav.Link>
            <Nav.Link as={Link} to="/signup">{t('registration')}</Nav.Link>
          </Nav>
          <AuthButton />
        </Navbar>

        <div className="container p-3 h-100 w-100">
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
  )
};

export default App;
