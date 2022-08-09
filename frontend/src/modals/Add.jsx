import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { socket } from '../index.js';
import { selectors } from '../slices/channelsSlice.js';

const generateOnSubmit = ({ onHide, modalInfo }) => (values) => {
  const newChannelName = values.channelName;
  const { changeChannel } = modalInfo;

  socket.emit('newChannel', { name: newChannelName });
  socket.on('newChannel', (payload) => {
    changeChannel(payload.id);
  });

  onHide();
};

const Add = (props) => {
  const channels = useSelector(selectors.selectAll);
  const { t } = useTranslation();

  const channelNames = channels.map((channel) => channel.name);
  const { onHide } = props;
  const f = useFormik({ 
    onSubmit: generateOnSubmit(props),
    initialValues: { channelName: '' },
    validationSchema: Yup.object({
      channelName: Yup.string()
        .notOneOf(channelNames, t('errors.other.existingChannel'))
        .required(t('errors.other.requiredChannelname')),
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('addChannel')}</Modal.Title>
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
              data-testid="input-channelName"
              name="channelName"
              isInvalid={f.errors.channelName}
            />
          </FormGroup>
          {f.touched.channelName && f.errors.channelName && (
            <div className='text-danger'>{f.errors.channelName}</div>
          )}
          <input type="submit" className="btn btn-primary mt-2" value={t('addChannel')} />
        </form>
      </Modal.Body>
    </Modal>
  )
};

export default Add;
