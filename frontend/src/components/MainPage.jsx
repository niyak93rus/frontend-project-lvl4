import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { normalize, schema } from 'normalizr';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import 'react-toastify/dist/ReactToastify.css';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';

import { socket } from '../index.js';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};


const MainPage = () => {
  const dispatch = useDispatch();
  const [currentChannelId, setCurrentChannel] = useState(1);
  const [appError, setAppError] = useState('');
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const notify = (message) => toast.error(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const getNormalized = (data) => {
    const message = new schema.Entity('messages');
    const channel = new schema.Entity('channels');

    const mySchema = { channels: [channel], messages: [message] };
    const normalizedData = normalize(data, mySchema);
    return normalizedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        const normalizedData = getNormalized(data);
        const { channels, messages } = normalizedData.entities;
  
        dispatch(channelsActions.setChannels({ entities: channels, ids: Object.keys(channels) }));
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

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      console.log(payload);
      dispatch(messagesActions.addMessage(payload))
    });

    socket.on('newChannel', (payload) => {
      console.log(payload);
      dispatch(channelsActions.addChannel(payload));
    });
  })

  const changeChannel = (channelId=1) => {
    setCurrentChannel(channelId);
    dispatch(channelsActions.setCurrentChannelId(channelId));
  };

  return (
    <>
    <div className="container row m-3 w-100">
      <Channels currentChannelId={currentChannelId} changeChannel={changeChannel} />
      <div className='col m-3'>
        <Messages currentChannelId={currentChannelId} />
        <MessageForm currentChannelId={currentChannelId} />
        {appError && <div className='text-danger'>{appError}</div>}
      </div>
    </div>
    </>
  );
}

export default MainPage;