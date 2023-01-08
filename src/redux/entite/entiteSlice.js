/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: []
};

export const entiteSlice = createSlice({
  name: 'entite',
  initialState,
  reducers: {
    setEntites: (state, action) => {
      state.data = action.payload;
    },
    addEntite: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      const newState = [...state.data, action.payload];
      // eslint-disable-next-line no-param-reassign
      state.data = newState;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setEntites, addEntite } = entiteSlice.actions;

export default entiteSlice.reducer;
