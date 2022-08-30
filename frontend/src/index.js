/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import init from './init.jsx';

const socket = io();

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const vdom = await init(socket);
  root.render(<React.StrictMode>{vdom}</React.StrictMode>);
};

app();

export default socket;
