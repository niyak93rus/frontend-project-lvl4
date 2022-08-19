import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { socket } from '../index.js';
import { selectors } from '../slices/channelsSlice.js';
import { actions } from '../slices/channelsSlice.js';
const generateOnSubmit = ({ onHide }, notify, dispatch) => (values) => {
  const { name } = values;

  socket.emit('newChannel', { name });
  socket.on('newChannel', (payload) => {
    dispatch(actions.setCurrentChannelId(payload.id));
  });
  notify('channelAdded');

  onHide();
};

const Add = (props) => {
  const channels = useSelector(selectors.selectAll);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const notify = (message) => toast.success(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const channelNames = channels.map((channel) => channel.name);
  const { onHide } = props;
  const f = useFormik({
    onSubmit: generateOnSubmit(props, notify, dispatch),
    initialValues: { name: '' },
    validationSchema: Yup.object({
      name: Yup.string()
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
        <Form onSubmit={f.handleSubmit}>
          <Form.Control
            required
            ref={inputRef}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            data-testid="input-name"
            name="name"
            id="name"
            isInvalid={f.errors.name && f.touched.name}
            disabled={f.isSubmitting}
          />
          <label className="visually-hidden" htmlFor="name">{t('modals.channelName')}</label>
          <Form.Control.Feedback type="invalid">
            {(f.errors.name)}
          </Form.Control.Feedback>
          <div className="d-flex justify-content-end mt-2">
            <Button
              className="me-2"
              variant="secondary"
              type="button"
              onClick={onHide}
            >
              {t('modals.cancel')}
            </Button>
            <input
              className='btn btn-primary'
              type='submit'
              disabled={f.isSubmitting}
              value={t('modals.submit')}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

export default Add;
