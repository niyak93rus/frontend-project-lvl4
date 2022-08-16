import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import remove from 'lodash/remove.js';

const defaultChannelId = 1;

const channelsAdapter = createEntityAdapter({ selectId: (channel) => channel.id });

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    setChannels(state, action) {
      console.log(action.payload);
      channelsAdapter.setAll(state, action.payload)
    },
    setCurrentChannelId(state, { payload }) {
      const currentChannelId = payload ?? defaultChannelId;
      state.currentChannelId = currentChannelId;
    },
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
