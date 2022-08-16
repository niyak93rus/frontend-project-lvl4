import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from "socket.io-client";

import 'bootstrap/dist/css/bootstrap.min.css';
import init from './init.jsx';
import './index.css';

export const socket = io();
socket.on('connect', () => {
  console.log("Connected to WS server");
});

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#root'));
  const socket = io();
  const vdom = await init(socket);
  root.render(<React.StrictMode>{vdom}</React.StrictMode>);
};

app();
