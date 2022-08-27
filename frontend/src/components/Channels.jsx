import React from 'react';
import { Button } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions } from '../slices/index.js';
import { getChannels, getCurrentChannelId } from '../selectors.js';

import Channel from './Channel.jsx';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(getChannels);
  const currentChannelId = useSelector(getCurrentChannelId);

  const handleChooseChannel = (channelId) => () => {
    dispatch(actions.setCurrentChannelId(channelId));
  };
  const handleAddChannel = () => {
    dispatch(actions.openModal({ type: 'addChannel' }));
  };
  const handleRemoveChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'removeChannel', extra: { channelId } }));
  };
  const handleRenameChannel = (channelId) => () => {
    dispatch(actions.openModal({ type: 'renameChannel', extra: { channelId } }));
  };

  return (
    <>
      <div className="col-4 col-md-auto border-end pt-5 px-0 bg-light">
        <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
          <span>{t('channels')}</span>
          <Button
            type="button"
            variant="group-vertical"
            className="p-0 text-primary"
            onClick={handleAddChannel}
          >
            <PlusSquare size={20} />
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul className="nav flex-column nav-pills nav-fill px-2">
          {channels.map((channel) => (
            <Channel
              key={channel.id}
              channel={channel}
              isCurrent={channel.id === currentChannelId}
              handleChoose={handleChooseChannel(channel.id)}
              handleRemove={handleRemoveChannel}
              handleRename={handleRenameChannel}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Channels;
