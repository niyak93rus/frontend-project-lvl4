import { createSlice } from '@reduxjs/toolkit';

// const channelsAdapter = createEntityAdapter();
// console.log(channelsAdapter);

const initialState = {
  ids: [],
  entities: {},
};
console.log(initialState)

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, { payload }) {
      console.log(payload);
      const { entities, ids } = payload;
      state.entities = entities;
      state.ids = ids;
    },
    setCurrentChannelId(state, { payload }) {
      const currentChannelId = payload;
      state.currentChannelId = currentChannelId;
      console.log(state.currentChannelId);
    },
  },
});

// export const selectors = channelsAdapter.getSelectors((state) => {
//   console.log(state);
//   return state.channels;
// });

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
