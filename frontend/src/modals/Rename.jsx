import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as Yup from 'yup';

import { socket } from '../index.js';
import { selectors } from '../slices/channelsSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const generateOnSubmit = ({ modalInfo, onHide }, dispatch) => (values) => {
  socket.emit('renameChannel', { id: modalInfo.item.id, name: values.channelName });
  socket.on('renameChannel', (payload) => {
    const { name, id } = payload;
    dispatch(channelsActions.renameChannel({ id, changes: { name } }));
  });
  onHide();
  // close dropdown automatically?
};

const Rename = (props) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const channelNames = channels.map((channel) => channel.name);
  const { onHide, modalInfo } = props;
  const { item } = modalInfo;

  const f = useFormik({ 
    onSubmit: generateOnSubmit(props, dispatch), 
    initialValues: item,
    validationSchema: Yup.object({
      channelName: Yup.string()
        .notOneOf(channelNames, 'Такой канал уже добавлен!')
        .required('Укажите название канала!'),
    }),
   });
  
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              defaultValue={item.name}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              data-testid="input-channelName"
              name="channelName"
              isInvalid={f.errors.channelName}
            />
          </FormGroup>
          {f.touched.channelName && f.errors.channelName && (
            <div className='text-danger'>{f.errors.channelName}</div>
          )}
          <input type="submit" className="btn btn-primary mt-2" value="Изменить имя" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
