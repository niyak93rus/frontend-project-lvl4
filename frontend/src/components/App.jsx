import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {  Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import { useAuth } from '../hooks/index.js';

import AuthButton from './AuthButton.jsx';
import AuthProvider from './AuthProvider.jsx';
import NoMatch from './NoMatch';
import LoginPage from './Login.jsx';
import MainPage from './MainPage';
import SignupPage from './Signup.jsx';

const MainRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.user ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar bg="light" expand="lg" className="align-items-stretch justify-content-between p-2">
        <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        <AuthButton />
      </Navbar>

      <div id="chat" className="container h-100 my-4 overflow-hidden rounded shadow">
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
