import 'bootstrap';
import i18next from 'i18next';
import leoProfanity from 'leo-profanity';
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as RollbarProvider } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';

import { actions } from './slices/index.js';
import { ApiContext } from './contexts/index.js';

import App from './components/App.jsx';
import getLogger from './lib/logger.js';
import resources from './locales/translation.js';

import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';
import modalReducer from './slices/modal.js';

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
      modal: modalReducer,
    },
  });

  socket.on('newMessage', (payload) => {
    logSocket('newMessage', payload);
    store.dispatch(actions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    logSocket('newChannel', payload);
    store.dispatch(actions.addChannel(payload));
    store.dispatch(actions.setCurrentChannelId(payload.id));
  });
  socket.on('removeChannel', (payload) => {
    logSocket('removeChannel', payload);
    store.dispatch(actions.removeChannel(payload.id));
    if (Number(store.getState().channels.currentChannelId) === Number(payload.id)) {
      store.dispatch(actions.setCurrentChannelId());
    }
  });
  socket.on('renameChannel', (payload) => {
    logSocket('renameChannel', payload);
    const { id, name } = payload;
    store.dispatch(actions.renameChannel({ id, changes: { name } }));
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
        },
      },
    });

  const rollbarConfig = {
    enabled: isProduction,
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  const vdom = (
    <Provider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <I18nextProvider i18n={i18n}>
          <ApiContext.Provider value={api}>
            <App />
          </ApiContext.Provider>
        </I18nextProvider>
      </RollbarProvider>
    </Provider>
  );

  return vdom;
};
