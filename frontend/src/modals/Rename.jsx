import * as Yup from 'yup';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { getChannels, getChannelById } from '../slices/channelsSlice.js';
import { useApi } from '../contexts/index.js';

const generateOnSubmit = (handleClose, channelId, api, notify, rollbar) => (values) => {
  const { name } = values;
  try {
    api.renameChannel({ id: channelId, name });
    notify('channelRenamed');
  } catch (err) {
    console.error(err);
    rollbar.error(err);
  }

  handleClose();
};

const Rename = ({ handleClose }) => {
  const api = useApi();
  const channels = useSelector(getChannels);
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const channelId = useSelector((state) => state.modal.extra?.channelId);
  const channel = useSelector(getChannelById(channelId));

  const notify = (message) => toast.success(t(`${message}`));

  const channelNames = channels.map((c) => c.name);

  const f = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: generateOnSubmit(handleClose, channelId, api, notify, rollbar),
    initialValues: {
      name: channel.name,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .notOneOf(channelNames, t('errors.other.existingChannel'))
        .required(t('errors.other.requiredChannelname')),
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('rename')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Control
            ref={inputRef}
            onChange={f.handleChange}
            onBlur={f.handleBlur}
            data-testid="input-name"
            name="name"
            id="name"
            value={f.values.name}
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
              onClick={handleClose}
            >
              {t('modals.cancel')}
            </Button>
            <input
              className="btn btn-primary"
              type="submit"
              disabled={f.isSubmitting}
              value={t('modals.submit')}
            />
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
