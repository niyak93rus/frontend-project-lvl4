import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { io } from "socket.io-client";
import { I18nextProvider } from 'react-i18next';

import App from './components/App.jsx';
import './i18n';
import store from './slices/index.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export const socket = io.connect();
window.socket = socket;
socket.on('connect', () => {
  console.log("Connected to WS server");
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <I18nextProvider>
      <App />
    </I18nextProvider>
  </Provider>
);

