import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import { useAuth } from '../contexts/index.js';

import AuthButton from './AuthButton.jsx';
import AuthProvider from './AuthProvider.jsx';
import NoMatchPage from './NoMatchPage.jsx';
import LoginPage from './LoginPage.jsx';
import MainPage from './MainPage';
import SignupPage from './SignupPage.jsx';

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.user ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const SignUpRoute = ({ children }) => {
  const auth = useAuth();

  return (
    auth.user ? <Navigate to="/" /> : children
  );
};

const LoginRoute = ({ children }) => {
  const auth = useAuth();

  return (
    auth.user ? <Navigate to="/" /> : children
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar bg="light" expand="lg" className="align-items-stretch justify-content-between p-2">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <AuthButton />
        </Navbar>

        <div id="chat" className="container-lg h-100 my-4 overflow-hidden rounded shadow">
          <Routes>
            <Route
              path="/"
              element={(
                <MainRoute>
                  <MainPage />
                </MainRoute>
              )}
            />
            <Route path="/login" element={<LoginRoute><LoginPage /></LoginRoute>} />
            <Route path="/signup" element={<SignUpRoute><SignupPage /></SignUpRoute>} />
            <Route path="*" element={<NoMatchPage />} />

          </Routes>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </Router>
  </AuthProvider>
);

export default App;
