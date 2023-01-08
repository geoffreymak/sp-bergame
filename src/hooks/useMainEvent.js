/* eslint-disable  */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setComptes } from '../redux/compte/compteSlice';
import { setEntites } from '../redux/entite/entiteSlice';
import { setBudget } from '../redux/budget/budgetSlice';
import { setExercices } from '../redux/exercice/exerciceSlice';

const { ipcRenderer } = window.require('electron');

export default function useMainEvent() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on('init-data-reply', (event, arg) => {
      if (!arg.error) {
        const { comptes, entites, budgets, exercices } = arg.data;
        dispatch(setComptes(comptes));
        dispatch(setEntites(entites));
        dispatch(setBudget(budgets));
        dispatch(setExercices(exercices));
      }
    });

    ipcRenderer.on('navigate-to', (event, url) => {
      history.push(url);
    });
    return () => {
      ipcRenderer.removeListener('init-data-reply', () => {});
    };
  }, []);
}
