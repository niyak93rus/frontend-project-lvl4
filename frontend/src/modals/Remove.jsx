import React from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { socket } from '../index.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const generateOnSubmit = ({ modalInfo, onHide }, dispatch, notify, t) => (e) => {
  e.preventDefault();
  const { changeChannel, item } = modalInfo;
  if (item.removable) {
    socket.emit('removeChannel', { id: item.id });
    notify['success']('channelRemoved');
  
    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
      changeChannel();
    });
    onHide();
  } else {
    const errorName = 'errors.other.notRemovable';
    console.error(t(errorName));
    notify['error'](errorName);
  }
};

const Remove = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const notify = {
    success: (message) => toast.success(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER
    }),
    error: (message) => toast.error(t(`${message}`), {
      position: toast.POSITION.BOTTOM_CENTER
    }),
  }

  const { onHide } = props;
  const onSubmit = generateOnSubmit(props, dispatch, notify, t);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('remove')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <span className='m-3'>{t('prompt')}</span>
            <input type="submit" className="btn btn-danger mt-2" value={t('remove')} />
          </FormGroup>
        </form>
      </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
  );
};

export default Remove;
