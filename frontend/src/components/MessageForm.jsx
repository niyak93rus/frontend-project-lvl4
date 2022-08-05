import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Form,
  Button,
  Row,
} from 'react-bootstrap';
import _ from 'lodash';

// import { selectors } from '../slices/usersSlice.js';
import { actions } from '../slices/messagesSlice.js';

import { socket } from '../index.js';

const MessageForm = (props) => {
  const { currentChannelId } = props;
  // const users = useSelector(selectors.selectAll);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const inputRef = useRef(null);

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
      socket.connected
        ? socket.emit('newMessage', message, (response) => {
          response.status === 'ok' ? dispatch(actions.addMessage(message)) : console.log('Something went wrong');
        })
        : console.log('Socket not connected');

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
            placeholder='Введите сообщение'
            ref={inputRef} 
            rows={1} />
        </Form.Group>

        <Form.Group className="mt-3" as={Row}>
          <Button variant="primary" type="submit">
            Отправить сообщение
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessageForm;
