import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { changeChannel, currentChannelId } = props;
  const channels = useSelector(selectors.selectAll);

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item, changeChannel });

  return (
    <>
      <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
        <div className='d-flex justify-content-between mb-2 ps-4 pe-2'>
          <span>{t('channels')}</span>
          <button type='button' className='p-0 text-primary btn btn-group-vertical' onClick={() => showModal('adding')} data-testid="item-add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
            </svg>
            <span class="visually-hidden">+</span>
          </button>
        </div>
        <ul className="list-group align-items-stretch justify-content-center">
          {channels.map((channel) => (
            <li key={channel.id} onClick={() => changeChannel(channel.id)} className="list-group-item p-0 m-0 border-0">
              {<div className="btn-group align-items-stretch w-100 border">
                <Button
                  className='p-1 text-nowrap'
                  variant={(channel.id === currentChannelId) ? 'secondary' : 'light'}
                  key={channel.id}
                  style={{ margin: 0 }}>
                  # {channel.name}
                </Button>
                <Button
                  type="button"
                  className="btn dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  variant={(channel.id === currentChannelId) ? 'secondary' : 'light'}>
                  <span className="sr-only"></span>
                </Button>
                <ul className="dropdown-menu">
                  <Button
                    className="dropdown-item"
                    onClick={() => showModal('renaming', channel)}
                    data-testid="item-rename">
                    {t('rename')}
                  </Button>
                  <Button
                    className="dropdown-item"
                    onClick={() => showModal('removing', channel)}
                    data-testid="item-remove">
                    {t('remove')}
                  </Button>
                </ul>
              </div>
              }
            </li>
          ))}
        </ul>
      </div>
      {renderModal({ modalInfo, hideModal })}
    </>
  );
};

export default Channels;