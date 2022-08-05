import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
// import _ from 'lodash';
import { socket } from '../index.js';
import { selectors } from '../slices/channelsSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';



const generateOnSubmit = ({ onHide, changeChannel }, channels, dispatch) => (values) => {
  const newChannelName = values.body;

  // STOPPED HERE - NEED TO CHANGE CHANNEL AFTER ADDING IT
  console.log(channels, changeChannel);

  if (!channels.includes(newChannelName)) {
    socket.emit('newChannel', { name: newChannelName });
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      changeChannel(payload.id);
    });
  }

  onHide();
};

const Add = (props) => {
  console.log(props);
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { onHide } = props;
  const f = useFormik({ onSubmit: generateOnSubmit(props, channels, dispatch), initialValues: { body: '' } });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.body}
              data-testid="input-body"
              name="body"
            />
          </FormGroup>
          <input type="submit" className="btn btn-primary mt-2" value="Добавить" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
