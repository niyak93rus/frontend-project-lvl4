import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// import { useImmer } from 'use-immer';

import { selectors } from '../slices/channelsSlice.js';
import getModal from '../modals/index.js';

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} />;
};

const Channels = (props) => {
  const { changeChannel, currentChannelId } = props;
  const channels = useSelector(selectors.selectAll);

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item, changeChannel });

  return (
    <>
      <div className="col-md-2 align-items-start float-left" style={{ width: "150px" }}>
        <span className='text-center d-flex justify-content-between'>
          Каналы
          <Button className='btn sm-5' onClick={() => showModal('adding')} data-testid="item-add">+</Button>
        </span>
        <nav className="navbar">
          <div className="mt-3">
            <ul className="list-group">
              {channels.map((channel) => (
                <li key={channel.id} onClick={() => changeChannel(channel.id)} className="list-group-item">
                  <Button className='btn chnl btn-block' variant={(channel.id === currentChannelId) ? 'secondary' : 'light'} key={channel.id}># {channel.name}</Button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      {renderModal({ modalInfo, hideModal })}
    </>
  );
};

export default Channels;