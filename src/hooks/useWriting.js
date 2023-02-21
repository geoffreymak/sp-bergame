/* eslint-disable */

import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
// import numeral from 'numeral';

// eslint-disable-next-line import/named
import { getCurrency } from '../utils/comptes';
import { v4 } from 'uuid';

const { ipcRenderer } = window.require('electron');

export default function useWriting() {
  const [writings, setWritings] = useState([]);
  // const devise = useSelector((state) => state.devises.data);
  const user = useSelector((state) => state.user.data);
  const exercices = useSelector((state) => state.exercices.data);

  // const site = useSelector((state) => state.site.data);

  const removeWriting = (payload) => {
    setWritings(
      writings.filter(
        (w) => w.uuid !== payload && w.id !== payload && w.piece !== payload
      )
    );
  };

  //  { taux,user}
  const addOneWriting = (writing) => {
    const data = {
      id: v4(),
      date: moment(writing.date).format(),
      piece: writing.piece,
      compte: `${writing.codeCompte}${writing.compte?.compte}`,
      compte_code: writing.compte?.compte,
      imputation: `${writing.codeImputation}${writing.imputation?.compte}`,
      imputation_code: writing.imputation?.compte,
      libelle: writing.libelle,
      devise: writing.devise,
      taux: writing.taux,
      parite: writing.parite,
      montant_usd: writing.montantUSD || 0,
      montant_cdf: writing.montantCDF || 0,
      montant_eur: writing.montantEUR || 0,
      montant_total_eur: writing.EUR,
      user: user?.username,
      exercice: exercices[0]?.code,
      type: writing.type
    };

    setWritings([...writings, data]);
  };

  const addWriting = (writing) => {
    const data1 = {
      id: v4(),
      date: moment(writing.date).format(),
      piece: writing.piece,
      compte: `${writing.codeCompte}${writing.compte?.compte}`,
      compte_code: writing.compte?.compte,
      imputation: `${writing.codeImputation}${writing.imputation?.compte}`,
      imputation_code: writing.imputation?.compte,
      libelle: writing.libelle,
      devise: writing.devise,
      taux: writing.taux,
      parite: writing.parite,
      montant_usd: writing.montantUSD || 0,
      montant_cdf: writing.montantCDF || 0,
      montant_eur: writing.montantEUR || 0,
      montant_total_eur: writing.EUR,
      user: user?.username,
      exercice: exercices[0]?.code,
      type: writing.type
    };

    const data2 = {
      ...data1,
      compte: `${writing.codeImputation}${writing.imputation?.compte}`,
      compte_code: writing.imputation?.compte,
      imputation: `${writing.codeCompte}${writing.compte?.compte}`,
      imputation_code: writing.compte?.compte,
      type: data1.type === 'C' ? 'D' : 'C'
    };

    setWritings([...writings, data1, data2]);
  };

  const setManyWriting = (writings) => {
    let formatedData = [];
    writings.forEach((writing) => {
      const data1 = {
        uuid: v4(),
        date: moment(writing.date).format(),
        piece: writing.piece,
        compte: `${writing.codeCompte}${writing.compte?.compte}`,
        compte_code: writing.compte?.compte,
        imputation: `${writing.codeImputation}${writing.imputation?.compte}`,
        imputation_code: writing.imputation?.compte,
        libelle: writing.libelle,
        devise: writing.devise,
        taux: writing.taux,
        parite: writing.parite,
        montant_usd: writing.montantUSD || 0,
        montant_cdf: writing.montantCDF || 0,
        montant_eur: writing.montantEUR || 0,
        montant_total_eur: writing.EUR,
        user: user?.username,
        exercice: exercices[0]?.code,
        type: writing.type
      };

      const data2 = {
        ...data1,
        uuid: v4(),
        compte: `${writing.codeImputation}${writing.imputation?.compte}`,
        compte_code: writing.imputation?.compte,
        imputation: `${writing.codeCompte}${writing.compte?.compte}`,
        imputation_code: writing.compte?.compte,
        type: data1.type === 'C' ? 'D' : 'C'
      };

      formatedData = [...formatedData, data1, data2];
    });
    setWritings(formatedData);
  };

  // const addVariousWriting = (writing) => {
  //   const data = {
  //     ...writing,
  //     date: moment(writing.date).format(),
  //     // devise: getCurrency(writing.devise),
  //     compte: writing.compte?.compte,
  //     imputation: writing.imputation?.compte,
  //     ref_imputation: writing.imputation?.ref_compte,
  //     correspond: writing.imputation?.correspond,
  //     intitule: writing.imputation?.correspond,
  //     ref_taux: devise.uuid,
  //     taux: devise[writing.devise],
  //     taux_usd: devise.usd_cdf,
  //     taux_eur: devise.eur_cdf,
  //     taux_cfa: devise.cfa_cdf,
  //     // user: user.username,
  //     journal: writing.piece.substr(0, 3)
  //   };

  //   setWritings([...writings, data]);
  // };

  const cleardWriting = () => {
    setWritings([]);
  };

  const saveWriting = useCallback(async () => {
    if (writings && writings.length) {
      const response = await ipcRenderer.invoke('add-writing', writings);
      return response;
    }
  }, [writings]);

  const correctWriting = useCallback(
    async (piece) => {
      if (writings && piece) {
        const response = await ipcRenderer.invoke('correct-writing', {
          writings,
          piece
        });
        return response;
      }
    },
    [writings]
  );

  return {
    writings,
    addWriting,
    removeWriting,
    addOneWriting,
    setWritings,
    // addVariousWriting,
    setManyWriting,
    cleardWriting,
    saveWriting,
    correctWriting
  };
}
