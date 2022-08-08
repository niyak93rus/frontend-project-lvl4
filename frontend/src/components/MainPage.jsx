import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { normalize, schema } from 'normalizr';

import axios from 'axios';

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

  const getNormalized = (data) => {
    const message = new schema.Entity('messages');
    const channel = new schema.Entity('channels');

    const mySchema = { channels: [channel], messages: [message] };
    const normalizedData = normalize(data, mySchema);
    return normalizedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      const normalizedData = getNormalized(data);
      const {
        channels,
        messages,
      } = normalizedData.entities;

      try {
        dispatch(channelsActions.setChannels({ entities: channels, ids: Object.keys(channels) }));
        if (!messages) return;
        dispatch(messagesActions.allMessages(messages));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  });

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      console.log(payload);
    });

    socket.on('newChannel', (payload) => {
      console.log(payload);
    });
  })

  const changeChannel = (channelId='1') => {
    setCurrentChannel(channelId);
    dispatch(channelsActions.setCurrentChannelId(channelId));
  };

  return (
    <>
    <div className="container row p-0 m-0 w-100">
      <Channels currentChannelId={currentChannelId} changeChannel={changeChannel} />
      <div className='col p-0'>
        <Messages currentChannelId={currentChannelId} />
        <MessageForm currentChannelId={currentChannelId} />
      </div>
    </div>
    </>
  );
}

export default MainPage;