import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';

import { actions as usersActions } from '../slices/usersSlice.js';
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

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      debugger
      console.log(data);
      // const normalizedData = getNormalized(data);
      const {
        channels,
        messages,
        currentChannelId,
      } = data;

      dispatch(channelsActions.setChannels(channels));
      // dispatch(channelsActions.setCurrentChannelId(currentChannelId));
      // dispatch(messagesActions.setMessage(messages));
    };

    fetchData();
  });

  return (
    <div className="container p-0">
      <div className='row row-cols-2'>
        <div className='col-sm'>
          <Channels />
        </div>
        <div className='col'>
        </div>
      </div>
    </div>
  );
}

export default MainPage;