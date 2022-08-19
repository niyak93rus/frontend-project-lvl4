import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    allUsers: usersAdapter.setAll,
  },
});

export const { actions } = usersSlice;
export const selectors = usersAdapter.getSelectors((state) => state.users);
export default usersSlice.reducer;
