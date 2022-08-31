import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../slices/index.js';

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
  const isOpened = useSelector((state) => state.modal.isOpened);

  const handleClose = () => {
    dispatch(actions.closeModal());
  };
  const modalType = useSelector((state) => state.modal.type);

  const Component = mapping[modalType];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
