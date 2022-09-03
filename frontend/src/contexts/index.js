import { createContext, useContext } from 'react';

export const AuthContext = createContext({});
export const ApiContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const useApi = () => {
  const api = useContext(ApiContext);

  return api;
};
