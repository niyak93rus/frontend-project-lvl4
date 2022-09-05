/* eslint-disable no-param-reassign */
import axios from 'axios';
import { normalize, schema } from 'normalizr';
import {
  createAsyncThunk, createSlice, createEntityAdapter,
} from '@reduxjs/toolkit';

import routes from '../routes.js';

const defaultChannelId = 1;

const getNormalized = (data) => {
  const message = new schema.Entity('messages');
  const channel = new schema.Entity('channels');
  const { currentChannelId } = data;

  const mySchema = { channels: [channel], messages: [message], currentChannelId };
  return normalize(data, mySchema);
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (headers) => {
    const { data } = await axios.get(routes.dataPath(), { headers });
    const normalizedData = getNormalized(data);

    return { ...normalizedData.entities, currentChannelId: normalizedData.result.currentChannelId };
  },
);

const channelsAdapter = createEntityAdapter({ selectId: (channel) => channel.id });

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    setChannels(state, action) {
      channelsAdapter.setAll(state, action.payload);
    },
    setCurrentChannelId(state, { payload }) {
      const currentChannelId = payload ?? defaultChannelId;
      state.currentChannelId = currentChannelId;
    },
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.setAll(state, channels);
        state.currentChannelId = currentChannelId;
        state.loading = 'idle';
        state.error = null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error;
      });
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const getChannels = selectors.selectAll;

export const getChannelById = (channelId) => (state) => {
  const channels = state.channels.entities;
  return Object.values(channels).find((c) => c.id === channelId);
};

export const getChannelIdFromModal = (state) => state.modal.extra?.channelId;
export const getCurrentChannelId = (state) => state.channels.currentChannelId;

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
