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
      <div className="col-sm-auto pt-3 px-0 bg-light">
        <h5 className='d-flex align-items-center justify-content-between p-2'>
          {t('channels')}
          <Button className='btn sm-5' onClick={() => showModal('adding')} data-testid="item-add">+</Button>
        </h5>
        <nav className="navbar w-100 m-0 p-0">
          <div className="mt-3">
            <ul className="list-group align-items-stretch justify-content-center">
              {channels.map((channel) => (
                <li key={channel.id} onClick={() => changeChannel(channel.id)} className="list-group-item p-0 m-0">
                  {<div className="btn-group align-items-stretch w-100">
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
        </nav>
      </div>
      {renderModal({ modalInfo, hideModal })}
    </>
  );
};

export default Channels;