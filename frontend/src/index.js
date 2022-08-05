import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { io } from "socket.io-client";

import App from './components/App.js';
import store from './slices/index.js';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const socket = io.connect();
socket.on('connect', () => {
  console.log("Connected to WS server");

  console.log(socket.connected);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

