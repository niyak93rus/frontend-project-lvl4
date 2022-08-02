import React from 'react';
import { useSelector } from 'react-redux';
import Message from './Message.jsx';

import { selectors } from '../slices/messagesSlice.js';

const Messages = () => {
  const { messages } = useSelector(selectors.selectAll);

  return (
    <div className="mt-3">
      {messages.map((message) => (
        <Message key={message.id} post={message} />
      ))}
    </div>
  );
};

export default Messages;
