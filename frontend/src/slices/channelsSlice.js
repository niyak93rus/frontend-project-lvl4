import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter({ selectId: (channel) => channel.id });

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    setChannels(state, { payload }) {
      const { entities, ids } = payload;
      state.entities = entities;
      state.ids = ids;
    },
    setCurrentChannelId(state, { payload }) {
      const currentChannelId = payload;
      state.currentChannelId = currentChannelId;
    },
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
