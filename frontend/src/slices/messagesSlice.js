import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter({ selectId: (message) => message.id });

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    allMessages(state, action) {
      messagesAdapter.setAll(state, action.payload)
    },
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);

export const { actions } = messagesSlice;
export default messagesSlice.reducer;