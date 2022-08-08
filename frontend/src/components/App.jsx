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

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import '../App.css';

import NoMatch from './NoMatch';
import LoginPage from './Login.jsx';
import MainPage from './MainPage';
import SignupPage from './Signup.jsx';

const checkAuthorization = () => {
  if (localStorage.getItem('userId')) {
    return true;
  }
  return false;
}

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(checkAuthorization());

  const logIn = () => setLoggedIn(true);
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
  const location = useLocation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выйти</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>Войти</Button>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/signup">Регистрация</Nav.Link>
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

      </Router>
    </AuthProvider>
  )
};

export default App;
