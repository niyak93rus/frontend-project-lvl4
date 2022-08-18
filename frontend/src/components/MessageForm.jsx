import _ from 'lodash';
import * as filter from 'leo-profanity'
import React, { useEffect, useState, useRef } from 'react';
import {  useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useApi } from '../hooks/index.js';

const MessageForm = (props) => {
  const { rollbar } = props;
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const api = useApi();

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const notify = (message) => toast.error(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  useEffect(() => {
    inputRef.current.focus();
  })

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = JSON.parse(localStorage.getItem('user')).username;
    const message = {
      body: filter.clean(data.get('body')),
      username,
      id: _.uniqueId(),
      channelId: currentChannelId,
    };

    if (message.body) {
      try {
        await api.sendMessage(message);
      } catch(err) {
        notify('errors.other.messageNotDelivered');
        rollbar('Message not delivered');
        console.error(err);
      }

      setText('');
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  return (
    <Form onSubmit={onSubmit} className='py-1 border rounded-2'>
      <div className="input-group">
        <input
          className='border-0 p-0 ps-2 form-control'
          name="body"
          id="body"
          as="input"
          value={text}
          onChange={(e) => handleChange(e)}
          placeholder={t('message.placeholder')}
          ref={inputRef}
          rows={1} />
        <button className='btn btn-group-vertical' type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
          </svg>
          <span className='visually-hidden'>{t('message.button')}</span>
        </button>
      </div>
    </Form>
  );
};

export default MessageForm;
