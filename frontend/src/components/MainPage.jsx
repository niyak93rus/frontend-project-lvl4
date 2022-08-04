import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { normalize, schema } from 'normalizr';
import axios from 'axios';

import routes from '../routes.js';

// import { actions as usersActions } from '../slices/usersSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const MainPage = () => {
  const dispatch = useDispatch();

  const getNormalized = (data) => {
    const message = new schema.Entity('messages');
    const channel = new schema.Entity('channels');

    const mySchema = { channels: [channel], messages: [message] };
    const normalizedData = normalize(data, mySchema );

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

      const { currentChannelId } = data;

      try {
        dispatch(channelsActions.setChannels({ entities: channels, ids: Object.keys(channels) }));
        dispatch(channelsActions.setCurrentChannelId(currentChannelId));
        if (!messages) return;
        dispatch(messagesActions.allMessages({ entities: messages, ids: Object.keys(messages) }));
      } catch (err) {
        console.error(err);
      }      
    };

    fetchData();
  });

  return (
    <div className="container p-0">
      <div className='row row-cols-2'>
        <div className='col-sm'>
          <Channels />
        </div>
        <div className='col-lg'>
          <Messages />
          <MessageForm />
        </div>
      </div>
    </div>
  );
}

export default MainPage;