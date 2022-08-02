import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice.js';
import channelsReducer from './channelsSlice.js';
import usersReducer from './usersSlice.js';

export default configureStore({
  reducer: {
    messagesReducer,
    channelsReducer,
    usersReducer,
  },
});
