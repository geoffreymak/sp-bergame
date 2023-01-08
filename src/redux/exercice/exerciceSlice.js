/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: []
};

export const exerciceSlice = createSlice({
  name: 'exercices',
  initialState,
  reducers: {
    setExercices: (state, action) => {
      state.data = action.payload;
    },
    addExercice: (state, action) => {
      const newData = state.data;
      newData.splice(0, 0, action.payload);
      state.data = newData;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setExercices, addExercice } = exerciceSlice.actions;

export default exerciceSlice.reducer;
