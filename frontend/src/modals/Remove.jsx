/* eslint-disable dot-notation */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, FormGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useApi } from '../contexts/index.js';

const generateOnSubmit = (handleClose, setLoading, channelId, notify, api, rollbar) => (e) => {
  setLoading(true);
  e.preventDefault();
  try {
    api.removeChannel({ id: channelId });
    notify['success']('channelRemoved');

    handleClose();
  } catch (err) {
    console.error(err);
    setLoading(false);
    rollbar.error(err);
  }
};

const Remove = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useApi();
  const rollbar = useRollbar();
  const channelId = useSelector((state) => state.modal.extra?.channelId);

  const [loading, setLoading] = useState(false);

  const notify = {
    success: (message) => toast.success(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER,
    }),
    error: (message) => toast.error(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER,
    }),
  };

  const onSubmit = generateOnSubmit(handleClose, setLoading, channelId, notify, api, rollbar);

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('remove')}</Modal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <span className="m-3">{t('prompt')}</span>
            <Button
              className="me-2"
              variant="secondary"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              {t('modals.cancel')}
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={onSubmit}
              disabled={loading}
            >
              {t('remove')}
            </Button>
          </FormGroup>
        </form>
      </Modal.Body>
    </>
  );
};

export default Remove;
