import * as Yup from 'yup';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { getChannels } from '../selectors.js';
import { useApi } from '../hooks/index.js';

const generateOnSubmit = ({ onHide }, api, notify) => (values) => {
  const { id, name } = values;
  api.renameChannel({ id, name });
  notify('channelRenamed');

  onHide();
};

const Rename = (props) => {
  const api = useApi();
  const channels = useSelector(getChannels);
  const { t } = useTranslation();

  const notify = (message) => toast.success(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER,
  });

  const channelNames = channels.map((channel) => channel.name);
  const { onHide, modalInfo } = props;
  const { item } = modalInfo;

  const f = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: generateOnSubmit(props, api, notify),
    initialValues: item,
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
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('rename')}</Modal.Title>
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
              className="btn btn-primary"
              type="submit"
              disabled={f.isSubmitting}
              value={t('modals.submit')}
            />
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
