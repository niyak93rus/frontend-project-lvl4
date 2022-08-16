import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { socket } from '../index.js';
import { selectors } from '../slices/channelsSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const generateOnSubmit = ({ modalInfo, onHide }, dispatch, notify) => (values) => {
  socket.emit('renameChannel', { id: modalInfo.item.id, name: values.channelName });
  notify('channelRenamed');
  
  socket.on('renameChannel', (payload) => {
    const { name, id } = payload;
    dispatch(channelsActions.renameChannel({ id, changes: { name } }));
  });
  onHide();
};

const Rename = (props) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);
  const { t } = useTranslation();

  const notify = (message) => toast.success(t(`${message}`), {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const channelNames = channels.map((channel) => channel.name);
  const { onHide, modalInfo } = props;
  const { item } = modalInfo;

  const f = useFormik({ 
    onSubmit: generateOnSubmit(props, dispatch, notify), 
    initialValues: item,
    validationSchema: Yup.object({
      channelName: Yup.string()
        .notOneOf(channelNames, t('errors.other.existingChannel'))
        .required(t('errors.other.requiredChannelname')),
    }),
   });
  
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('rename')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              defaultValue={item.name}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              data-testid="input-channelName"
              name="channelName"
              isInvalid={f.errors.channelName}
              disabled={f.isSubmitting}
            />
          </FormGroup>
          {f.errors.channelName && (
            <div className='text-danger'>{f.errors.channelName}</div>
          )}
          <input type="submit" className="btn btn-primary mt-2" disabled={f.isSubmitting} value={t('rename')} />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
