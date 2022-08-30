import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { animateScroll } from 'react-scroll';
import { nanoid } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import { getMessages, getChannels, getCurrentChannelId } from '../selectors.js';

import Message from './Message.jsx';
import MessageForm from './MessageForm.jsx';

const Messages = () => {
  const { t } = useTranslation();
  const messages = useSelector(getMessages);
  const channels = useSelector(getChannels);
  const currentChannelId = useSelector(getCurrentChannelId);
  const currentChannel = channels.find((c) => Number(c.id) === Number(currentChannelId));
  const messagesCount = messages
    .filter((m) => Number(m.channelId) === Number(currentChannelId))
    .length;

  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 });
  }, [messages.length]);

  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow">
          <p className="m-0">
            <b>{`# ${currentChannel?.name}`}</b>
          </p>
          <span className="text-muted">
            {t("messagesCount", { count: messagesCount })}
          </span>
        </div>
        <div id="messages-box" className="d-flex flex-column chat-messages overflow-auto px-5" style={{height: "500px"}}>
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
          <div className="mt-auto px-5 py-3">
            <MessageForm />
          </div>
        </div>
      </div>
    </>);
};

export default Messages;
