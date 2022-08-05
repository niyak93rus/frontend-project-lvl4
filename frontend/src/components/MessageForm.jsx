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

const MessageForm = () => {
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
    };

    if (message.body) {
      socket.connected ? socket.emit('newMessage', message) : console.log('Socket not connected!');
      
      setText('');
    }

    console.log(message);
    dispatch(actions.addMessage(message));
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  return (
    <div className="m-3">
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label htmlFor="body">Текст</Form.Label>
          <Form.Control name="body" id="body" as="textarea" value={text} onChange={(e) => handleChange(e)} ref={inputRef} rows={3} />
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
