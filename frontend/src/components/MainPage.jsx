import React, { useCallback, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';

import { fetchChannels } from '../slices/channelsSlice.js';
import { useAuth } from '../contexts/index.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import Modal from './Modal.jsx';

const mapState = (state) => state.channels;

const MainPage = ({ loading }) => {
  const dispatch = useDispatch();
  const [appError, setAppError] = useState('');
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const auth = useAuth();
  const notify = useCallback((message) => toast.error(t(`${message}`)), [t]);

  useEffect(() => {
    const headers = auth.getAuthHeader();

    try {
      dispatch(fetchChannels(headers));
    } catch (err) {
      console.error(err.message);
      if (err.name === 'AxiosError') {
        const errorName = 'errors.other.axiosError';
        setAppError(t(errorName));
        notify(errorName);
      } else {
        const errorName = 'errors.other.unnknownError';
        setAppError(t(errorName));
        notify(errorName);
      }

      rollbar.error(err);
    }
  }, [auth, dispatch, rollbar, t, notify]);

  return loading
    ? (
      <div className="h-100 d-flex justify-content-center align-items-center" style={{ minHeight: '600px' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    )
    : (
      <>
        <Modal />
        <div className="row h-100 bg-white flex-md-row">
          <Channels />
          <div className="col p-0 h-100">
            <Messages />
            {appError && <div className="text-danger">{appError}</div>}
          </div>
        </div>
      </>
    );
};

export default connect(mapState)(MainPage);
