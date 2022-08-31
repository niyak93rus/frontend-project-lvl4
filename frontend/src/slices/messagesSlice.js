import { createSlice, createEntityAdapter, current } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

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
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        const filtered = Object.values(current(state.entities))
          .filter((m) => m.channelId !== payload);
        messagesAdapter.setAll(state, filtered);
      });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
