import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slices/index.js';
import { modalInfo } from '../slices/modal.js';

import AddChannelForm from '../modals/Add.jsx';
import RemoveChannelForm from '../modals/Remove.jsx';
import RenameChannelForm from '../modals/Rename.jsx';

const mapping = {
  addChannel: AddChannelForm,
  removeChannel: RemoveChannelForm,
  renameChannel: RenameChannelForm,
};

const Modal = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.closeModal());
  };

  const { isOpened, type } = useSelector(modalInfo);

  const Component = mapping[type];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
