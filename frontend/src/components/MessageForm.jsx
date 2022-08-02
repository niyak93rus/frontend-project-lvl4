// @ts-check

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Button,
  Row,
} from 'react-bootstrap';
import _ from 'lodash';

import { selectors } from '../slices/usersSlice.js';
import { actions } from '../slices/messagesSlice.js';

const MessageForm = () => {
  const users = useSelector(selectors.selectAll);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const message = {
      body: data.get('body'),
      author: data.get('author'),
      id: _.uniqueId(),
      comments: [],
    };

    dispatch(actions.addMessage(message));
  };

  return (
    <div className="m-3">
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label htmlFor="body">Текст</Form.Label>
          <Form.Control name="body" id="body" as="textarea" rows={3} />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label htmlFor="messageAuthor" column sm="2">
            Автор сообщения
          </Form.Label>
          <Form.Control name="author" id="messageAuthor" as="select">
            <option value="">{null}</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </Form.Control>
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
