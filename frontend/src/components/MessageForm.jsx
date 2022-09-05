import { uniqueId } from 'lodash';
import * as filter from 'leo-profanity';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useApi } from '../contexts/index.js';
import { getCurrentChannelId } from '../slices/channelsSlice.js';

const MessageForm = () => {
  const rollbar = useRollbar();
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const api = useApi();

  const currentChannelId = useSelector(getCurrentChannelId);

  const notify = (message) => toast.error(t(`${message}`));

  useEffect(() => {
    inputRef.current.focus();
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const { username } = JSON.parse(localStorage.getItem('user'));
    const message = {
      body: filter.clean(data.get('body')),
      username,
      id: uniqueId(),
      channelId: currentChannelId,
    };

    if (message.body) {
      try {
        await api.sendMessage(message);
      } catch (err) {
        notify('errors.other.messageNotDelivered');
        rollbar.error(t('errors.other.messageNotDelivered'));
        console.error(err);
      }

      setText('');
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <Form onSubmit={onSubmit} className="mt-auto py-1 border rounded-2">
      <div className="input-group">
        <input
          aria-label={t('messageFormLabel')}
          className="border-0 p-0 ps-2 form-control"
          name="body"
          id="body"
          as="input"
          value={text}
          onChange={(e) => handleChange(e)}
          placeholder={t('message.placeholder')}
          ref={inputRef}
          rows={1}
        />
        <button className="btn btn-group-vertical" type="submit">
          <ArrowRightSquare />
          <span className="visually-hidden">{t('message.button')}</span>
        </button>
      </div>
    </Form>
  );
};

export default MessageForm;
