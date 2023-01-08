import { configureStore } from '@reduxjs/toolkit';
import compteReducer from './compte/compteSlice';
import userReducer from './user/userSlice';
import entiteReducer from './entite/entiteSlice';
import budgetReducer from './budget/budgetSlice';
import exerciceReducer from './exercice/exerciceSlice';

export default configureStore({
  reducer: {
    comptes: compteReducer,
    entites: entiteReducer,
    user: userReducer,
    exercices: exerciceReducer,
    budget: budgetReducer
  }
});
