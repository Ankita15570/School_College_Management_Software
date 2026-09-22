import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  academicYear: "2025 - 2026",
};

const academicYearSlice = createSlice({
  name: 'academicYear',
  initialState,
  reducers: {
    setAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
  },
});

export const { setAcademicYear } = academicYearSlice.actions;
export default academicYearSlice.reducer;