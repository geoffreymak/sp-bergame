/* eslint-disable camelcase */
const globalBalance = require('./globalBalance');
const studentsList = require('./studentsList');
const caisseReport = require('./caisseReport');
// eslint-disable-next-line camelcase
const balance_generale = require('./balance_generale');
const balance_generale_correspond = require('./balance_generale_correspond');
const balance_auxiliaire = require('./balance_auxiliaire');
const grand_livre = require('./grand_livre');
const grand_livre_auxiliaire = require('./grand_livre_auxiliaire');
const bilan = require('./bilan');
const tableau_exploitation = require('./tableau_exploitation');
const journaux = require('./journaux');
const journal = require('./journal');
const liste_comptes = require('./liste_comptes');
const compte_resultat = require('./compte_resultat');
const bilan_actif = require('./bilan_actif');
const bilan_passif = require('./bilan_passif');
const tableau_correspondance = require('./tableau_correspondance');
const cash_report_day = require('./cash_report_day');
const cash_report_mouth = require('./cash_report_mouth');
const budget_year = require('./budget_year');
const budget_month = require('./budget_month');

module.exports = {
  globalBalance,
  studentsList,
  caisseReport,
  balance_generale,
  balance_generale_correspond,
  balance_auxiliaire,
  grand_livre,
  grand_livre_auxiliaire,
  bilan,
  tableau_exploitation,
  journaux,
  journal,
  liste_comptes,
  compte_resultat,
  bilan_actif,
  bilan_passif,
  tableau_correspondance,
  cash_report_day,
  cash_report_mouth,
  budget_year,
  budget_month
};
