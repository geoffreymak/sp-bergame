import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: []
};

export const compteSlice = createSlice({
  name: 'comptes',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    setComptes: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.data = action.payload;
    },
    addCompte: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      const newState = [...state.data, action.payload];
      const data = newState?.sort((a, b) => {
        if (a.compte < b.compte) {
          return -1;
        }
        if (a.compte > b.compte) {
          return 1;
        }
        return 0;
      });

      // eslint-disable-next-line no-param-reassign
      state.data = data;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setComptes, addCompte } = compteSlice.actions;

export default compteSlice.reducer;
