import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message.jsx';
import { nanoid } from '@reduxjs/toolkit'

import { selectors } from '../slices/messagesSlice.js';

const Messages = (props) => {
  const messages = useSelector(selectors.selectAll);
  const { currentChannelId } = props;

  return messages.length > 0
    ? (<div className="mt-3">
      <ul className="list-group">
        {messages
          .filter((message) => Number(message.channelId) === Number(currentChannelId))
          .map((message) => (
            <li key={nanoid()} className="list-group-item">
              <Message key={message.id} message={message} />
            </li>
          ))}
      </ul>
    </div>
    )
    : null
};

export default Messages;
