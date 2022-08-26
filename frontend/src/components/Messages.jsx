import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { nanoid } from '@reduxjs/toolkit';

import { selectors as messageSelectors } from '../slices/messagesSlice.js';

import Message from './Message.jsx';
import MessageForm from './MessageForm.jsx';

const Messages = () => {
  const messages = useSelector(messageSelectors.selectAll);
  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 });
  }, [messages.length]);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {messages.length > 0
        ? (
          <ul className="list-group bg-light">
            {messages
              .filter((message) => Number(message.channelId) === Number(currentChannelId))
              .map((message) => (
                <li key={nanoid()} className="list-group-item border-0">
                  <Message key={message.id} message={message} />
                </li>
              ))}
          </ul>
        )
        : null}
      <div className="px-5 py-3">
        <MessageForm />
      </div>
    </div>);
};

export default Messages;
