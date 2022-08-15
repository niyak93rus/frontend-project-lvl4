import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { normalize, schema } from 'normalizr';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import 'react-toastify/dist/ReactToastify.css';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { selectors as channelSelectors } from '../slices/channelsSlice.js';
import { selectors as messageSelectors } from '../slices/messagesSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';

import { socket } from '../index.js';
import useAuth from '../hooks/index.js';
import routes from '../routes.js';

const Header = (props) => {
  const { currentChannelId } = props;
  const channels = useSelector(channelSelectors.selectAll);
  const messages = useSelector(messageSelectors.selectAll);

  const currentChannel = channels.find((channel) => Number(channel.id) === Number(currentChannelId));
  if (!currentChannel) return;

  const messagesCount = messages.reduce((prev, curr) => curr.channelId === currentChannelId ? prev + 1 : prev, 0)
  const channelName = `# ${currentChannel.name}`;

  return (
    <>
      <p className='m-0'>
        <b>{channelName}</b>
      </p>
      <span className='text-muted'>{`${messagesCount} сообщений`}</span>
    </>
  )
}

const MainPage = () => {
  const dispatch = useDispatch();
  const [currentChannelId, setCurrentChannelId] = useState(1);
  const [appError, setAppError] = useState('');
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const auth = useAuth();

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
        const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
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
  });

  const changeChannel = (channelId = 1) => {
    setCurrentChannelId(channelId);
    dispatch(channelsActions.setCurrentChannelId(channelId));
  };

  return (
    <>
      <div className="row h-100 bg-white flex-md-row">
        <Channels currentChannelId={currentChannelId} changeChannel={changeChannel} />
        <div className='col p-0 h-100'>
          <div className='d-flex flex-column h-100'>
            <div className='bg-light mb-4 p-3 shadow'>
              <Header currentChannelId={currentChannelId} />
            </div>
            <div className='mt-auto px-5 py-3'>
              <Messages currentChannelId={currentChannelId} />
              <MessageForm currentChannelId={currentChannelId} />
              {appError && <div className='text-danger'>{appError}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;