import React, { useMemo, useState } from 'react';
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

import { useAuth } from '../hooks/index.js';
import { AuthContext } from '../contexts/index.js';

import NoMatch from './NoMatch';
import LoginPage from './Login.jsx';
import MainPage from './MainPage';
import SignupPage from './Signup.jsx';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  const authData = useMemo(() => ({
    logIn, logOut, getAuthHeader, user,
  }), [user]);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.user ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation('translation');
  const location = useLocation();

  if (!location.pathname === '/login') {
    return (auth.user
      ? <Button onClick={auth.logOut}>{t('logOut')}</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>{t('logIn')}</Button>);
  }
  return null;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar bg="light" expand="lg" className="align-items-stretch justify-content-between p-2">
        <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        <AuthButton />
      </Navbar>

      <div className="container h-100 my-4 overflow-hidden rounded shadow">
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
);

export default App;
