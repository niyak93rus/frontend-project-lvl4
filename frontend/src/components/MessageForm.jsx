import React, { useEffect, useState, useRef } from 'react';
import {
  Form,
  Button,
  Row,
} from 'react-bootstrap';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { socket } from '../index.js';

const MessageForm = (props) => {
  const { currentChannelId } = props;
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  })

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = JSON.parse(localStorage.getItem('userId')).username;
    const message = {
      body: data.get('body'),
      username,
      id: _.uniqueId(),
      comments: [],
      channelId: currentChannelId,
    };

    if (message.body) {
      socket.emit('newMessage', message, (response) => {
        if (!response.status === 'ok') {
          throw new Error(t('messageNotDelivered'));
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
