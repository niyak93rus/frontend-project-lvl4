/* eslint-disable dot-notation */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, FormGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { useApi } from '../contexts/index.js';
import { getChannelIdFromModal } from '../slices/channelsSlice.js';

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
  const channelId = useSelector(getChannelIdFromModal);

  const [loading, setLoading] = useState(false);

  const notify = {
    success: (message) => toast.success(t(`${message}`)),
    error: (message) => toast.error(t(`${message}`)),
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
