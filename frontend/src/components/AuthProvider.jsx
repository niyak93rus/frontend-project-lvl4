import React, { useMemo, useState } from 'react';
import { AuthContext } from '../contexts/index.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser
    ? { username: currentUser.username, token: currentUser.token } : null);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const authData = useMemo(() => {
    const getAuthHeader = () => (user?.token ? { Authorization: `Bearer ${user.token}` } : {});
    return {
      logIn, logOut, getAuthHeader, user,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
