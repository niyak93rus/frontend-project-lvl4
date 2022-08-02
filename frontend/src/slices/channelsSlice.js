import { createSlice } from '@reduxjs/toolkit';

// const channelsAdapter = createEntityAdapter();
// console.log(channelsAdapter);

const initialState = {
  channels: [],
}
console.log(initialState)

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, { payload }) {
      state.channels = payload;
    },
  },
});

// export const selectors = channelsAdapter.getSelectors((state) => {
//   console.log(state);
//   return state.channels;
// });

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
