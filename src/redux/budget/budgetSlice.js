/* eslint-disable operator-linebreak */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: []
};

export const budgetSlice = createSlice({
  name: 'butget',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    setBudget: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.data = action.payload;
    },
    addBudget: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      const newState = [...state.data, action.payload];
      const data = newState?.sort((a, b) => a.entite?.localeCompare(b.entite));
      // eslint-disable-next-line no-param-reassign
      state.data = data;
    },
    updateBudget: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      const newState = state.data?.map((s) => {
        if (
          s.compte === action.payload.compte &&
          s.entite === action.payload.entite
        ) {
          return { ...s, ...action.payload };
        }
        return s;
      });
      const data = newState?.sort((a, b) => a.entite?.localeCompare(b.entite));
      // eslint-disable-next-line no-param-reassign
      state.data = data;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setBudget, addBudget, updateBudget } = budgetSlice.actions;

export default budgetSlice.reducer;
