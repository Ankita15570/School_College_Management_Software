import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,
  organizationId: null,
  organizations: null,
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.role = action.payload.role;
      state.organizationId = action.payload.organizationId;
      state.organizations = action.payload.organizations;
    },
    clearUserInfo: (state) => {
      state.role = null;
      state.organizationId = null;
      state.organizations = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;