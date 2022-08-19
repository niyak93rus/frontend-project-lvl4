import React from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useApi } from '../hooks/index.js';

const generateOnSubmit = ({ modalInfo, onHide }, notify, t, api) => (e) => {
  e.preventDefault();
  const { item } = modalInfo;
  if (item.removable) {
    api.removeChannel({ id: item.id });
    notify['success']('channelRemoved');

    onHide();
  } else {
    const errorName = 'errors.other.notRemovable';
    console.error(t(errorName));
    notify['error'](errorName);
  }
};

const Remove = (props) => {
  const { t } = useTranslation();
  const api = useApi();

  const notify = {
    success: (message) => toast.success(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER
    }),
    error: (message) => toast.error(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER
    }),
  }

  const { onHide } = props;
  const onSubmit = generateOnSubmit(props, notify, t, api);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <span className='m-3'>{t('prompt')}</span>
            <button type="submit" className="btn btn-danger mt-2">{t('remove')}</button>
          </FormGroup>
        </form>
      </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
  );
};

export default Remove;
