import { useContext } from 'react';

import authContext from '../contexts/index.js';

const useAuth = () => useContext(authContext);

export default useAuth;
