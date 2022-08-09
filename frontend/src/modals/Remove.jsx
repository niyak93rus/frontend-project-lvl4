import React from 'react';
import { Modal, FormGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { socket } from '../index.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const generateOnSubmit = ({ modalInfo, onHide }, dispatch) => (e) => {
  e.preventDefault();
  const { changeChannel } = modalInfo;
  socket.emit('removeChannel', { id: modalInfo.item.id });
  socket.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
    changeChannel();
  });
  onHide();
};

const Remove = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { onHide } = props;
  const onSubmit = generateOnSubmit(props, dispatch);

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
