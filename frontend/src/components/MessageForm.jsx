import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Button,
  Row,
} from 'react-bootstrap';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as filter from 'leo-profanity'

import 'react-toastify/dist/ReactToastify.css';

import { socket } from '../index.js';

filter.loadDictionary('ru');

const MessageForm = (props) => {
  const { currentChannelId } = props;
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const notify = (message) => toast.error(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  useEffect(() => {
    inputRef.current.focus();
  })

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = JSON.parse(localStorage.getItem('userId')).username;
    const message = {
      body: filter.clean(data.get('body')),
      username,
      id: _.uniqueId(),
      comments: [],
      channelId: currentChannelId,
    };

    if (message.body) {
      socket.emit('newMessage', message, (response) => {
        if (!response.status === 'ok') {
          notify('errors.other.messageNotDelivered');
          throw new Error(t('errors.other.messageNotDelivered'));
        }
      });

      setText('');
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  return (
    <div className="m-3">
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Control
            name="body"
            id="body"
            as="textarea"
            value={text}
            onChange={(e) => handleChange(e)}
            placeholder={t('message.placeholder')}
            ref={inputRef}
            rows={1} />
        </Form.Group>

        <Form.Group className="mt-3" as={Row}>
          <Button variant="primary" type="submit">
            {t('message.button')}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessageForm;
