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
        <span className='text-center'>
          {t('channels')}
          <Button className='btn sm-5' onClick={() => showModal('adding')} data-testid="item-add">+</Button>
        </span>
        <nav className="navbar w-100">
          <div className="mt-3">
            <ul className="list-group">
              {channels.map((channel) => (
                <li key={channel.id} onClick={() => changeChannel(channel.id)} className="list-group-item">
                  {<div className="btn-group d-flex">
                    <Button
                      className='btn btn-block'
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
                    <div className="dropdown-menu">
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
                    </div>
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