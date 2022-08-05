import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message.jsx';
import { nanoid } from '@reduxjs/toolkit'

import { selectors } from '../slices/messagesSlice.js';

const Messages = () => {
  const messages = useSelector(selectors.selectAll);

  return messages.length > 0 
    ? (<div className="mt-3">
    <ul className="list-group">
      {messages.map((message) => (
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
