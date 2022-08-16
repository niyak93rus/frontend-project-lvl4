import { combineReducers } from '@reduxjs/toolkit';
import channelsSlice, { actions as channelsActions } from './channelsSlice.js';
import messagesSlice, { actions as messagesActions } from './messagesSlice.js';
import modal, { actions as modalActions } from './modal.js';

const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

export {
  actions,
};

export default combineReducers({
  channelsSlice,
  messagesSlice,
  modal,
});
