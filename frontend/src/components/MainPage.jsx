import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { normalize, schema } from 'normalizr';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const MainPage = () => {
  const dispatch = useDispatch();
  const [appError, setAppError] = useState('');
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const auth = useAuth();

  const notify = (message) => toast.error(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER,
  });

  const getNormalized = (data) => {
    const message = new schema.Entity('messages');
    const channel = new schema.Entity('channels');
    const { currentChannelId } = data;

    const mySchema = { channels: [channel], messages: [message], currentChannelId };
    const normalizedData = normalize(data, mySchema);
    return normalizedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
        const normalizedData = getNormalized(data);

        const { channels, messages } = normalizedData.entities;

        dispatch(channelsActions.setChannels(channels));
        dispatch(channelsActions.setCurrentChannelId(channels.currentChannelId));
        if (!messages) return;
        dispatch(messagesActions.allMessages(messages));
      } catch (err) {
        console.error(err.message);
        if (err.name === 'AxiosError') {
          const errorName = 'errors.other.axiosError';
          setAppError(t(errorName));
          notify(errorName);
        } else {
          const errorName = 'errors.other.unnknownError';
          setAppError(t(errorName));
          notify(errorName);
        }

        rollbar.error(err);
      }
    };

    fetchData();
  });

  return (
    <div id="chat" className="row h-100 bg-white flex-md-row">
      <Channels />
      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <Messages />
          {appError && <div className="text-danger">{appError}</div>}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
