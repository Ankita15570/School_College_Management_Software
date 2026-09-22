import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from './../slices/userInfoSlice';
import academicYearSlice from './../slices/academicYearSlice';

export const store = configureStore({
  reducer: {
    userInfo: userInfoSlice,
    academicYear: academicYearSlice,
  },
});

export default store;