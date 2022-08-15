import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message.jsx';
import { nanoid } from '@reduxjs/toolkit'

import { selectors } from '../slices/messagesSlice.js';

const Messages = (props) => {
  const messages = useSelector(selectors.selectAll);
  const { currentChannelId } = props;

  return messages.length > 0
    ? (<div className="m-3 bg-light">
      <ul className="list-group bg-light">
        {messages
          .filter((message) => Number(message.channelId) === Number(currentChannelId))
          .map((message) => (
            <li key={nanoid()} className="list-group-item border-0">
              <Message key={message.id} message={message} />
            </li>
          ))}
      </ul>
    </div>
    )
    : null
};

export default Messages;
