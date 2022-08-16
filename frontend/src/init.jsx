/* eslint-disable import/no-anonymous-default-export */
import 'bootstrap';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import Rollbar from 'rollbar';
import leoProfanity from 'leo-profanity';

import { ApiContext } from './contexts/index.js';

import App from './components/App.jsx';
import getLogger from './lib/logger.js';
import { actions } from './slices/index.js';
import resources from './locales/translation.js';
import { changeChannel } from './components/MainPage.jsx'

import messagesReducer from './slices/messagesSlice.js';
import channelsReducer from './slices/channelsSlice.js';

const { translation } = resources;

const logSocket = getLogger('socket');

export default async (socket) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const ruDict = leoProfanity.getDictionary('ru');
  leoProfanity.add(ruDict);

  const withAcknowledgement = (socketFunc) => (...args) => new Promise((resolve, reject) => {
    let state = 'pending'; // eslint-disable-line
    const timer = setTimeout(() => {
      state = 'rejected';
      reject();
    }, 3000);

    socketFunc(...args, (response) => {
      if (state !== 'pending') return;

      clearTimeout(timer);

      if (response.status === 'ok') {
        state = 'resolved';
        resolve(response.data);
      }

      reject();
    });
  });

  const api = {
    sendMessage: withAcknowledgement((...args) => socket.volatile.emit('newMessage', ...args)),
    createChannel: withAcknowledgement((...args) => socket.volatile.emit('newChannel', ...args)),
    renameChannel: withAcknowledgement((...args) => socket.volatile.emit('renameChannel', ...args)),
    removeChannel: withAcknowledgement((...args) => socket.volatile.emit('removeChannel', ...args)),
  };

  const store = configureStore({
    reducer: {
      messages: messagesReducer,
      channels: channelsReducer,
    },
  });

  socket.on('newMessage', (payload) => {
    logSocket('newMessage', payload);
    store.dispatch(actions.addMessage({ message: payload }));
  });
  socket.on('newChannel', (payload) => {
    logSocket('newChannel', payload);
    store.dispatch(actions.addChannel({ channel: payload }));
  });
  socket.on('removeChannel', (payload) => {
    logSocket('removeChannel', payload);
    // changeChannel(); STOPPPED HERE - not changing channel after removing
    store.dispatch(actions.removeChannel({ channelId: payload.id }));
  });
  socket.on('renameChannel', (payload) => {
    logSocket('renameChannel', payload);
    store.dispatch(actions.renameChannel({
      channelId: payload.id,
      channelName: payload.name,
    }));
  });

  const i18n = i18next.createInstance();

  await i18n
  .use(initReactI18next)
  .init({
    debug: true,
    lng: 'ru',
    resources: {
      ru: {
        translation,
      }
    },
  });

  const rollbarConfig = {
      enabled: isProduction,
      accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
    };
  
  const rollbar = new Rollbar(rollbarConfig);

  const vdom = (
    <Provider store={store} instance={rollbar}>
      <I18nextProvider i18n={i18n}>
        <ApiContext.Provider value={api}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );

  return vdom;
};