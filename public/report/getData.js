/* eslint-disable */
const _ = require('lodash');

const ecritureModel = require('../models/ecritures');
const pastEcritureModel = require('../models/pastEcritures');
const budgetModel = require('../models/budgets');
const pastBudgetModel = require('../models/pastBudgets');
const compteModel = require('../models/comptes');
const exerciceModel = require('../models/exercices');

// const correspondeModel = require('../models/corresponds');
// const journalModel = require('../models/journals');
// const resultcompteModel = require('../models/resultcompte');
// const resultsumModel = require('../models/resultsum');
// const actifbilanModel = require('../models/actifbilan');
// const actifsumModel = require('../models/actifsum');
// const passifbilanModel = require('../models/passifbilan');
// const passifsumModel = require('../models/passifsum');
// const balancesPastModel = require('../models/balancesPast');
// const balancescorrespPastModel = require('../models/balancescorrespPast');

const {
  groupCompte,
  groupCompteDetailed,
  groupCompteDaily,
  getRangeCompte,
  groupCompteBudget,
  groupJournalDetailed2

  // groupJournalDetailed,
  // getUniqueCompte,
  // groupCompteBilan,
  // getResultCompte,
  // getSumOfResultCompte,
  // getSumOfBilanActif,
  // getSumOfBilanPassif,
  // getResultCompteBilanPassif,
  // getResultCompteBilanActif,
  // groupCompteByNote,
  // groupByDayWithReport
} = require('../helpers/comptes');

// const BALANCE_GENERALE_CORRESPOND = 'balance_generale_correspond';
// const BALANCE_AUXILIAIRE = 'balance_auxiliaire';
// const GRAND_LIVRE_AUXILIAIRE = 'grand_livre_auxiliaire';
// const BILAN = 'bilan';
// const TABLEAU_EXPLOITAION = 'tableau_exploitation';
// const JOURNAUX = 'journaux';
// const COMPTE_RESULTAT = 'compte_resultat';
// const BILAN_ACTIF = 'bilan_actif';
// const BILAN_PASSIF = 'bilan_passif';
// const TABLEAU_CORRESPONDANCE = 'tableau_correspondance';

const JOURNAL = 'journal';
const LISTE_COMPTES = 'liste_comptes';
const GRAND_LIVRE = 'grand_livre';
const BALANCE_GENERALE = 'balance_generale';
const CASH_REPORT_DAY = 'cash_report_day';
const CASH_REPORT_MOUTH = 'cash_report_mouth';
const BUDGET_MONTH = 'budget_month';
const BUDGET_YEAR = 'budget_year';

const getData = async (data) => {
  const comptesData = await compteModel.find().sort({ compte: 1 }).lean();

  const exerciceData = await exerciceModel.find().sort({ code: -1 }).lean();

  const ecritureFilter = { exercice: data?.exercice };

  let finalEcritureModel = ecritureModel;
  let finalBudgetModel = budgetModel;

  if (
    data?.exercice &&
    exerciceData &&
    exerciceData[0]?.code !== data?.exercice
  ) {
    finalEcritureModel = pastEcritureModel;
    finalBudgetModel = pastBudgetModel;
  }

  const ecritureData = await finalEcritureModel
    .find(ecritureFilter)
    .sort({ imputation: 1 })
    .lean();

  switch (data.type) {
    case BALANCE_GENERALE: {
      const filtredCompte = getRangeCompte(comptesData, data.compte, 'compte');
      let finalEcritureData = ecritureData;
      if (data.entite && data.entite.code !== 'T') {
        finalEcritureData = finalEcritureData.filter(
          (d) => d['compte'].substr(1, 1) === data.entite.code
        );
      }
      const clearData = groupCompte(
        finalEcritureData,
        filtredCompte,
        data,
        'compte',
        'compte_code'
      );

      return clearData;
    }
    case GRAND_LIVRE: {
      const filtredCompte = getRangeCompte(comptesData, data.compte, 'compte');
      let finalEcritureData = ecritureData;

      if (data.entite && data.entite.code !== 'T') {
        finalEcritureData = finalEcritureData.filter(
          (d) => d['compte'].substr(1, 1) === data.entite.code
        );
      }
      const clearData = groupCompteDetailed(
        finalEcritureData,
        filtredCompte,
        data,
        'compte',
        'compte_code'
      );

      return clearData;
    }
    case CASH_REPORT_DAY: {
      const filtredCompte = comptesData.filter(
        (compte) => data.compte?.slice(2) === compte.compte
      );
      let finalEcritureData = ecritureData.filter(
        (e) => e.compte === data.compte
      );

      const clearData = groupCompteDaily(
        finalEcritureData,
        filtredCompte,
        data,
        'compte',
        'compte_code'
      );

      return clearData;
    }
    case CASH_REPORT_MOUTH: {
      const filtredCompte = comptesData.filter(
        (compte) => data.compte?.slice(2) === compte.compte
      );
      let finalEcritureData = ecritureData.filter(
        (e) => e.compte === data.compte
      );

      const clearData = groupCompteDaily(
        finalEcritureData,
        filtredCompte,
        data,
        'compte',
        'compte_code'
      );

      return clearData;
    }
    case BUDGET_YEAR:
    case BUDGET_MONTH: {
      const budgetsData = await finalBudgetModel
        .find({ entite: data.entite?.code, exercice: data?.exercice })
        .sort({ compte: 1 })
        .lean();

      const finalEcritureData = ecritureData.filter(
        (e) => e.compte?.slice(1, 2) === data.entite?.code
      );

      const clearData = groupCompteBudget(
        finalEcritureData,
        budgetsData,
        data,
        'compte',
        'compte_code'
      );

      return { month: data.month, data: clearData };
    }
    case JOURNAL: {
      const clearData = groupJournalDetailed2(ecritureData, data);
      return clearData;
    }
    case LISTE_COMPTES: {
      const comptes = await compteModel.find().sort({ compte: 1 }).lean();
      return comptes;
    }

    // case BALANCE_GENERALE_CORRESPOND: {
    //   const correspondeData = await correspondeModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();
    //   const clearData = groupCompte(
    //     ecritureData,
    //     correspondeData,
    //     data,
    //     'compte',
    //     'correspond'
    //   );

    //   return clearData;
    // }
    // case BALANCE_AUXILIAIRE: {
    //   const filtredCompte = getRangeCompte(
    //     getUniqueCompte(comptesData, 'compte').filter(
    //       (d) =>
    //         d.ref_compte.startsWith('40') ||
    //         d.ref_compte.startsWith('41') ||
    //         d.ref_compte.startsWith('421') ||
    //         d.ref_compte.startsWith('2622')
    //     ),
    //     data.compte,
    //     'compte'
    //   );
    //   const clearData = groupCompte(
    //     ecritureData,
    //     filtredCompte,
    //     data,
    //     'compte',
    //     'imputation'
    //   );
    //   return clearData;
    // }
    // case GRAND_LIVRE_AUXILIAIRE: {
    //   const filtredCompte = getRangeCompte(
    //     getUniqueCompte(comptesData, 'compte').filter(
    //       (d) =>
    //         d.ref_compte.startsWith('40') ||
    //         d.ref_compte.startsWith('41') ||
    //         d.ref_compte.startsWith('421') ||
    //         d.ref_compte.startsWith('2622')
    //     ),
    //     data.compte,
    //     'compte'
    //   );
    //   const clearData = groupCompteDetailed(
    //     ecritureData,
    //     filtredCompte,
    //     data,
    //     'compte',
    //     'imputation'
    //   );
    //   return clearData;
    // }
    // case BILAN: {
    //   const filtredCompte = getUniqueCompte(comptesData, 'ref_compte').filter(
    //     (d) =>
    //       d.ref_compte.startsWith('1') ||
    //       d.ref_compte.startsWith('2') ||
    //       d.ref_compte.startsWith('3') ||
    //       d.ref_compte.startsWith('4') ||
    //       d.ref_compte.startsWith('5')
    //   );
    //   const clearData = groupCompteBilan(
    //     ecritureData,
    //     filtredCompte,
    //     data,
    //     'ref_compte',
    //     'ref_imputation'
    //   );
    //   return clearData;
    // }
    // case TABLEAU_EXPLOITAION: {
    //   const filtredCompte = getUniqueCompte(comptesData, 'ref_compte').filter(
    //     (d) => d.ref_compte.startsWith('6') || d.ref_compte.startsWith('7')
    //   );
    //   const clearData = groupCompteBilan(
    //     ecritureData,
    //     filtredCompte,
    //     data,
    //     'ref_compte',
    //     'ref_imputation'
    //   );
    //   return clearData;
    // }
    // case TABLEAU_CORRESPONDANCE: {
    //   const clearData = groupCompteByNote(
    //     ecritureData,
    //     comptesData,
    //     data,
    //     'ref_compte',
    //     'ref_imputation'
    //   );
    //   return clearData;
    // }
    // case JOURNAUX: {
    //   const journalData = await journalModel.find().sort({ compte: 1 }).lean();
    //   return journalData;
    // }
    // case COMPTE_RESULTAT: {
    //   const resultcompteData = await resultcompteModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();

    //   const resultsumData = await resultsumModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();

    //   const ecritureDataPast = await balancescorrespPastModel.find().lean();

    //   const clearData = getResultCompte(
    //     ecritureData,
    //     ecritureDataPast,
    //     resultcompteData,
    //     data,
    //     'compte',
    //     'correspond'
    //   );
    //   // console.log('clearData', clearData);
    //   return getSumOfResultCompte(resultsumData, clearData);
    // }
    // case BILAN_ACTIF: {
    //   const actifbilanData = await actifbilanModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();

    //   const actifsumData = await actifsumModel.find().sort({ index: 1 }).lean();
    //   const ecritureDataPast = await balancesPastModel.find().lean();

    //   const clearData = getResultCompteBilanActif(
    //     ecritureData,
    //     ecritureDataPast,
    //     actifbilanData,
    //     data,
    //     'compte',
    //     'correspond'
    //   );
    //   // console.log('clearData', clearData);
    //   return getSumOfBilanActif(actifsumData, clearData);
    // }
    // case BILAN_PASSIF: {
    //   //PASSIF
    //   const passifbilanData = await passifbilanModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();
    //   const passifsumData = await passifsumModel
    //     .find()
    //     .sort({ index: 1 })
    //     .lean();
    //   const ecritureDataPast = await balancesPastModel.find().lean();

    //   //COMPTE RESULTAT
    //   const resultcompteData = await resultcompteModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();
    //   const resultsumData = await resultsumModel
    //     .find()
    //     .sort({ ordre: 1 })
    //     .lean();
    //   const ecritureResultDataPast = await balancescorrespPastModel
    //     .find()
    //     .lean();

    //   const clearResultData = getResultCompte(
    //     ecritureData,
    //     ecritureResultDataPast,
    //     resultcompteData,
    //     data,
    //     'compte',
    //     'correspond'
    //   );

    //   const clearData = getResultCompteBilanPassif(
    //     ecritureData,
    //     ecritureDataPast,
    //     passifbilanData,
    //     data,
    //     'compte',
    //     'correspond'
    //   );

    //   const XI = getSumOfResultCompte(resultsumData, clearResultData).find(
    //     (d) => d.compt1 === 'XI'
    //   );

    //   return getSumOfBilanPassif(
    //     passifsumData,
    //     clearData.map((d) =>
    //       d.compt1 === 'CJ'
    //         ? { ...d, solde1: XI?.solde1 || 0, solde2: XI?.solde2 || 0 }
    //         : d
    //     )
    //   );
    // }
    default:
      break;
  }
};
module.exports = getData;
