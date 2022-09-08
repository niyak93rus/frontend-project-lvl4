/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, current } from '@reduxjs/toolkit';

import { actions as channelActions, fetchChannels } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter({ selectId: (message) => message.id });

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    allMessages(state, action) {
      messagesAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, action) => {
        const { messages } = action.payload;
        if (!messages) return;
        messagesAdapter.setAll(state, messages);
        state.error = null;
      })
      .addCase(channelActions.removeChannel, (state, { payload }) => {
        const filtered = Object.values(current(state.entities))
          .filter((m) => m.channelId !== payload);
        state.messages = filtered;
      });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);

export const getMessages = selectors.selectAll;

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
