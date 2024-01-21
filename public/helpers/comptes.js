/*eslint-disable */

const { isEqual, isAfter, isBefore } = require('date-fns');
const moment = require('moment');
const _ = require('lodash');
const numeral = require('numeral');
const appLog = require('./appLog');

const getComptesStartsWith = (comptes = [], searchString, field = 'compte') => {
  return comptes.filter((compte) => compte[field].startsWith(searchString));
};

const TB_COR_NOTE = [
  { note: '21', intitule: "CHIFFRES D'AFFAIRES ET AUTRES PRODUITS" },
  { note: '22', intitule: 'ACHATS' },
  { note: '23', intitule: 'TRANSPORTS' },
  { note: '24', intitule: 'SERVICES EXTERIEURS' },
  { note: '25', intitule: 'IMPOTS ET TAXES' },
  { note: '26', intitule: 'AUTRES CHARGES' },
  { note: '27', intitule: 'CHARGES DE PERSONNEL' },
  { note: '29', intitule: 'CHARGES ET REVENUS FINANCIERS' }
];

const TB_COR_VALUES = [
  { compte: '7021', intitule: 'Ventes de produits fabriqués', note: '21' },
  {
    compte: '7061',
    intitule: 'Ventes des travaux et services rendus',
    note: '21'
  },
  {
    compte: '7073',
    intitule: 'Produits accessoires',
    note: '21'
  },
  {
    compte: '7181',
    intitule: "Subvention d'exploitation",
    note: '21'
  },
  {
    compte: '756',
    intitule: 'Autres Produits',
    note: '21'
  },
  {
    compte: '6041',
    intitule: 'Matières Consommables',
    note: '22'
  },
  {
    compte: '6042',
    intitule: 'Matières Combustibles',
    note: '22'
  },
  {
    compte: '6043',
    intitule: "Produits d'entretien",
    note: '22'
  },
  {
    compte: '6044',
    intitule: "Fournitures d'entretien",
    note: '22'
  },
  {
    compte: '6051',
    intitule: 'Fournitures non stockable - Eau',
    note: '22'
  },
  {
    compte: '6052',
    intitule: 'Fournitures non stockable - Electricité',
    note: '22'
  },
  {
    compte: '6054',
    intitule: "Fourn.d'ent.Non st. Autres energies",
    note: '22'
  },
  {
    compte: '602',
    intitule: 'Achats dans la region',
    note: '22'
  },
  {
    compte: '6047',
    intitule: 'Fournitures de bureau',
    note: '22'
  },
  {
    compte: '6046',
    intitule: '-',
    note: '22'
  },
  {
    compte: '6080',
    intitule: "Achat d'emballages",
    note: '22'
  },
  {
    compte: '6131',
    intitule: 'Transport pour le compte des tiers',
    note: '23'
  },
  {
    compte: '614',
    intitule: 'Transport du personnel',
    note: '23'
  },
  {
    compte: '616',
    intitule: 'Transport des plis',
    note: '23'
  },
  {
    compte: '618',
    intitule: 'Autres transports',
    note: '23'
  },
  {
    compte: '621',
    intitule: 'Sous traitance Générale',
    note: '24'
  },
  {
    compte: '622',
    intitule: 'Location et charges locatives',
    note: '24'
  },
  {
    compte: '624',
    intitule: 'Entretiens, réparat. et maintenances',
    note: '24'
  },
  {
    compte: '625',
    intitule: "Prime d'assuranse",
    note: '24'
  },
  {
    compte: '626',
    intitule: 'Etudes, recher. et documentations',
    note: '24'
  },
  {
    compte: '627',
    intitule: 'Publicité, publication, rel. Publiques',
    note: '24'
  },
  {
    compte: '628',
    intitule: 'Frais de télécommunications',
    note: '24'
  },
  {
    compte: '631',
    intitule: 'Frais bancaires',
    note: '24'
  },
  {
    compte: '632',
    intitule: "Rémunération d'intérm. & de Cons",
    note: '24'
  },
  {
    compte: '633',
    intitule: 'Frais de formation du Personnel',
    note: '24'
  },
  {
    compte: '635',
    intitule: 'Cotisations',
    note: '24'
  },
  {
    compte: '638',
    intitule: 'Autres charges Externes',
    note: '24'
  },
  {
    compte: '647',
    intitule: 'Pénalités et amendes fiscales',
    note: '25'
  },
  {
    compte: '656',
    intitule: 'Pertes sur créances clients',
    note: '26'
  },
  {
    compte: '658',
    intitule: 'Indemnités de fonction et autres',
    note: '26'
  },
  {
    compte: '659',
    intitule: 'Charges pour provisions et prov. pr',
    note: '26'
  },
  {
    compte: '661',
    intitule: 'Rémun. directes vers. au personnel',
    note: '27'
  },
  {
    compte: '663',
    intitule: 'Indemnités forfait. versées au pers.',
    note: '27'
  },
  {
    compte: '664',
    intitule: 'Charges sociales',
    note: '27'
  },
  {
    compte: '667',
    intitule: 'Personnel intérimaire et détaché',
    note: '27'
  },
  {
    compte: '668',
    intitule: 'Autres charges sociales.',
    note: '27'
  },
  {
    compte: '67',
    intitule: 'Frais financiers',
    note: '29'
  },
  {
    compte: '771',
    intitule: 'Interets des prets et créances div.',
    note: '29'
  },
  {
    compte: '776',
    intitule: 'Gains de change',
    note: '29'
  }
];

const BILAN_INCOMES_DATA = [
  { compte: '050', empty: 0 },
  { compte: '051', empty: 0 },
  { compte: '052', empty: 0 },
  { compte: '053', empty: 0 },
  { compte: '054', empty: 0 },
  { compte: '055', empty: 0 },
  { compte: '056', empty: 0 },
  { compte: '057', empty: 0 }
];
let BILAN_OUTPUTS_DATA = [
  { compte: '001', empty: 0 },
  { compte: '002', empty: 0 },
  { compte: '003', empty: 0 },
  { compte: '004', empty: 0 },
  { compte: '005', empty: 0 },
  { compte: '008', empty: 0 },
  { compte: '009', empty: 0 },
  { compte: '010', empty: 0 },
  { compte: '011', empty: 0 },
  { compte: '012', empty: 0 },
  { compte: '030', empty: 0 },
  { compte: '013', empty: 0 },
  { compte: '014', empty: 1 },
  { compte: '015', empty: 0 },
  { compte: '007', empty: 0 },
  { compte: '016', empty: 0 },
  { compte: '017', empty: 0 },
  { compte: '018', empty: 0 },
  { compte: '019', empty: 0 },
  { compte: '006', empty: 0 },
  { compte: '021', empty: 0 },
  { compte: '022', empty: 0 },
  { compte: '023', empty: 0 },
  { compte: '024', empty: 0 },
  { compte: '063', empty: 1 },
  { compte: '025', empty: 0 },
  { compte: '026', empty: 0 },
  { compte: '027', empty: 1 },
  { compte: '020', empty: 0 },
  { compte: '029', empty: 0 }
];

const MOUTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];

const getCurrency = (devise) => {
  switch (devise) {
    case 'usd':
      return '$';
    case 'cdf':
      return 'Fc';
    case 'eur':
      return '€';
    case '€':
      return 'eur';
    case '$':
      return 'usd';
    case 'Fc':
      return 'cdf';
    default:
      return '';
  }
};

const getWritingsSum = (writing = [], type = 'D') => {
  return writing
    .filter((v) => v.type === type)
    .reduce((prev, curr) => {
      return prev + parseFloat(curr.montant);
    }, 0);
};

function groupAlgo(numberChar, data, field) {
  const dataCopy = [...data];
  let number = '';
  let numberArr = [];
  let dataLength = dataCopy.length;

  for (let idx = 0; idx < dataLength; idx++) {
    const d = dataCopy[idx];

    if (d && d[field]?.substr(0, numberChar) === number) {
      numberArr = [...numberArr, d];
    } else if (
      d &&
      d[field]?.substr(0, numberChar) !== number &&
      !numberArr.length
    ) {
      number = d[field]?.substr(0, numberChar);
      numberArr = [...numberArr, d];
    } else if (!d?.classe) {
      const fakeLine = numberArr.reduce(
        (prev, curr) => {
          const debit = parseFloat(prev.debit + curr.debit);
          const credit = parseFloat(prev.credit + curr.credit);
          const debit1 = parseFloat(prev.debit1 + curr.debit1);
          const credit1 = parseFloat(prev.credit1 + curr.credit1);

          return { debit, credit, debit1, credit1 };
        },
        {
          debit: 0,
          credit: 0,
          debit1: 0,
          credit1: 0
        }
      );
      // if (number === '8') //console.log('fakeLine', fakeLine);
      dataCopy.splice(idx, 0, {
        ...fakeLine,
        compt1: '',
        compt2: '',
        intitule: '',
        classe: number
      });

      numberArr = [];
      number = '';
    }

    dataLength = dataCopy.length;

    if (dataLength - 1 === idx && numberArr.length !== 0) {
      dataLength++;
    }
  }
  return dataCopy;
}

function groupAlgoCompte(numberChar, data, field) {
  const dataCopy = [...data];
  let number = '';
  let numberArr = [];
  let dataLength = dataCopy.length;

  for (let idx = 0; idx < dataLength; idx++) {
    const d = dataCopy[idx];

    if (d && d[field]?.substr(0, numberChar) === number) {
      numberArr = [...numberArr, d];
    } else if (
      d &&
      d[field]?.substr(0, numberChar) !== number &&
      !numberArr.length
    ) {
      number = d[field]?.substr(0, numberChar);
      numberArr = [...numberArr, d];
    } else if (!d?.classe) {
      // if (number === '8') //console.log('fakeLine', fakeLine);
      dataCopy.splice(idx - numberArr.length, 0, {
        classe: number
      });

      numberArr = [];
      number = '';
    }

    dataLength = dataCopy.length;

    if (dataLength - 1 === idx && numberArr.length !== 0) {
      dataLength++;
    }
  }
  return dataCopy;
}

const totalSum = (data) => {
  const fakeLine = data.reduce(
    (prev, curr) => {
      const debit = parseFloat(prev.debit + curr.debit);
      const credit = parseFloat(prev.credit + curr.credit);
      return { debit, credit };
    },
    {
      debit: 0,
      credit: 0
    }
  );
  return fakeLine;
};

const groupCompte = (
  ecritureData,
  comptes,
  printDate,
  field = 'compte',
  field2 = 'imputation_code'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let groups = {};
  let formatedData = [];
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  if (printDate?.entite && printDate?.entite.code !== 'T') {
    for (const compte in group) {
      if (Object.hasOwnProperty.call(group, compte)) {
        const data = group[compte].data;
        const compt = group[compte].compte;

        data.forEach((d) => {
          if (groups[d['compte']]) {
            groups[d['compte']].data = [...groups[d['compte']].data, d];
          } else {
            groups[d['compte']] = {
              compte: { ...compt, compte: d['compte'] },
              data: [d]
            };
          }
        });
      }
    }
  } else {
    groups = group;
  }
  // //console.log('group', group);
  for (const compte in groups) {
    if (Object.hasOwnProperty.call(groups, compte)) {
      const data = groups[compte].data;
      const compt = groups[compte].compte;

      // //console.log('dataBefore :', dataBefore.length);
      const filtredData = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          (isAfter(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) &&
            isBefore(
              currDate.setHours(0, 0, 0, 0),
              toDate.setHours(0, 0, 0, 0)
            )) ||
          isEqual(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      const soldes = filtredData.reduce(
        (prev, curr) => {
          let currentTaux = 1;
          switch (printDate.devise) {
            case 'cdf':
              currentTaux = curr.taux;
              break;
            case 'usd':
              currentTaux = curr.parite;
              break;
            case 'eur':
              currentTaux = 1;
              break;
            default:
              break;
          }

          const debit =
            curr.type === 'D'
              ? parseFloat(prev.debit + curr.montant_total_eur * currentTaux)
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(prev.credit + curr.montant_total_eur * currentTaux)
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      formatedData.push({
        ...soldes,
        intitule: compt?.intitule || '',
        compt1: compte || '',
        compte: compt
      });
    }
  }

  return formatedData
    .filter((d) => !!+d.debit || !!+d.credit)
    .sort((a, b) => a.compt1?.localeCompare(b.compt1));
};

const groupCompteBilan = (
  data,
  comptes,
  printDate,
  field = 'ref_compte',
  field2 = 'ref_imputation'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = [];
  let soldeDebit = [];
  let soldeCredit = [];
  comptes.forEach((d) => {
    const val = data.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      // //console.log('dataBefore :', dataBefore.length);
      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          (isAfter(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) &&
            isBefore(
              currDate.setHours(0, 0, 0, 0),
              toDate.setHours(0, 0, 0, 0)
            )) ||
          isEqual(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      const soldeAfter = dataAfter.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      if (soldeAfter.debit > soldeAfter.credit) {
        const montant = soldeAfter.debit - soldeAfter.credit;
        if (montant) {
          soldeDebit.push({
            intitule: compt?.intitule || '',
            compte: compte || '',
            montant
          });
        }
      } else {
        const montant = soldeAfter.credit - soldeAfter.debit;
        if (montant) {
          soldeCredit.push({
            intitule: compt?.intitule || '',
            compte: compte || '',
            montant
          });
        }
      }
    }
  }

  const len =
    soldeDebit.length > soldeCredit.length
      ? soldeDebit.length
      : soldeCredit.length;

  for (let idx = 0; idx < len; idx++) {
    const value1 = soldeDebit[idx];
    const value2 = soldeCredit[idx];
    formatedData.push({
      compt1: value1 ? value1.compte : '',
      compt2: value2 ? value2.compte : '',
      intitule1: value1 ? value1.intitule : '',
      intitule2: value2 ? value2.intitule : '',
      montant1: value1 ? value1.montant : 0,
      montant2: value2 ? value2.montant : 0
    });
  }

  return formatedData;
};

const groupCompteDetailed = (
  ecritureData,
  comptes,
  printDate,
  field = 'compte',
  field2 = 'imputation_code'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let groups = {};
  let formatedData = {};
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  if (printDate?.entite && printDate?.entite.code !== 'T') {
    for (const compte in group) {
      if (Object.hasOwnProperty.call(group, compte)) {
        const data = group[compte].data;
        const compt = group[compte].compte;

        data.forEach((d) => {
          if (groups[d['compte']]) {
            groups[d['compte']].data = [...groups[d['compte']].data, d];
          } else {
            groups[d['compte']] = {
              compte: { ...compt, compte: d['compte'] },
              data: [d]
            };
          }
        });
      }
    }
  } else {
    groups = group;
  }

  // //console.log('group', group);
  for (const compte in groups) {
    if (Object.hasOwnProperty.call(groups, compte)) {
      const data = groups[compte].data;
      const compt = groups[compte].compte;

      // //console.log('data :', data.length);
      const dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return isBefore(
          currDate.setHours(0, 0, 0, 0),
          fromDate.setHours(0, 0, 0, 0)
        );
      });
      // //console.log('dataBefore :', dataBefore.length);
      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          (isAfter(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) &&
            isBefore(
              currDate.setHours(0, 0, 0, 0),
              toDate.setHours(0, 0, 0, 0)
            )) ||
          isEqual(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      // //console.log('dataAfter :', dataAfter.length);
      const soldeBefore = dataBefore.reduce(
        (prev, curr) => {
          let currentTaux = 1;
          switch (printDate.devise) {
            case 'cdf':
              currentTaux = d.taux;
              break;
            case 'usd':
              currentTaux = d.parite;
              break;
            case 'eur':
              currentTaux = 1;
              break;
            default:
              break;
          }

          const debit =
            curr.type === 'D'
              ? parseFloat(prev.debit + curr.montant_total_eur * currentTaux)
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(prev.credit + curr.montant_total_eur * currentTaux)
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const dataAfterFormated = dataAfter
        .map((d) => {
          let currentTaux = 1;
          switch (printDate.devise) {
            case 'cdf':
              currentTaux = d.taux;
              break;
            case 'usd':
              currentTaux = d.parite;
              break;
            case 'eur':
              currentTaux = 1;
              break;
            default:
              break;
          }
          d.montant = parseFloat(d.montant_total_eur * currentTaux);
          return d;
        })
        .sort((a, b) => {
          const date1 = new Date(a.date);
          const date2 = new Date(b.date);
          return date1.getTime() - date2.getTime();
        });

      formatedData = {
        ...formatedData,
        [compte]: {
          report: soldeBefore,
          compte: compt,
          data: dataAfterFormated
        }
      };
    }
  }

  return Object.values(formatedData)
    .filter((v) => v.data && v.data.length)
    .sort((a, b) => a.compte.compte.localeCompare(b.compte.compte));
};

const groupCompteDaily = (
  ecritureData,
  comptes,
  printDate,
  field = 'compte',
  field2 = 'imputation_code'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let groups = {};
  let formatedData = {};
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      data.forEach((d) => {
        if (groups[d['compte']]) {
          groups[d['compte']].data = [...groups[d['compte']].data, d];
        } else {
          groups[d['compte']] = {
            compte: { ...compt, compte: d['compte'] },
            data: [d]
          };
        }
      });
    }
  }

  // //console.log('group', group);
  for (const compte in groups) {
    if (Object.hasOwnProperty.call(groups, compte)) {
      const data = groups[compte].data;
      const compt = groups[compte].compte;

      // //console.log('data :', data.length);
      const dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return isBefore(
          currDate.setHours(0, 0, 0, 0),
          fromDate.setHours(0, 0, 0, 0)
        );
      });
      // //console.log('dataBefore :', dataBefore.length);
      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          (isAfter(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) &&
            isBefore(
              currDate.setHours(0, 0, 0, 0),
              toDate.setHours(0, 0, 0, 0)
            )) ||
          isEqual(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      // //console.log('dataAfter :', dataAfter.length);
      const soldeBefore = dataBefore.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? parseFloat(prev.debit + curr.montant_total_eur)
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(prev.credit + curr.montant_total_eur)
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const dataAfterFormated = dataAfter.sort((a, b) => {
        const date1 = new Date(a.date);
        const date2 = new Date(b.date);
        return date1.getTime() - date2.getTime();
      });

      formatedData = {
        ...formatedData,
        [compte]: {
          report: soldeBefore,
          compte,
          compt,
          data: dataAfterFormated
        }
      };
    }
  }

  return Object.values(formatedData)
    .filter((v) => v.data && v.data.length)
    .sort((a, b) => a.compte.compte.localeCompare(b.compte.compte));
};

const groupCompteBudget = (
  ecritureData,
  comptes,
  printDate,
  field = 'compte',
  field2 = 'compte_code'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let groups = {};
  let formatedData = [];
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    groups[d[field]] = { compte: d, data: val };
  });

  // //console.log('group', group);
  for (const compte in groups) {
    if (Object.hasOwnProperty.call(groups, compte)) {
      const data = groups[compte].data;
      const compt = groups[compte].compte;

      const parite = printDate.parite;
      const previsionUSD = compt.prevision;
      const previsionEUR = previsionUSD / parite;
      const moyenne = previsionEUR / 12;

      const results = Array(12)
        .fill({})
        .map((_, idx) => {
          const currData = data.filter((d) => {
            const currDate = new Date(d.date);
            return currDate.getMonth() === idx;
          });

          const soldes = currData.reduce(
            (prev, curr) => {
              const debit =
                curr.type === 'D'
                  ? parseFloat(prev.debit + curr.montant_total_eur)
                  : prev.debit;
              const credit =
                curr.type === 'C'
                  ? parseFloat(prev.credit + curr.montant_total_eur)
                  : prev.credit;

              return { debit, credit };
            },
            {
              debit: 0,
              credit: 0
            }
          );

          const { debit, credit } = soldes;
          let montant = 0;

          if (compt.type === 'D') {
            montant = debit - credit;
          } else if (compt.type === 'C') {
            montant = credit - debit;
          } else {
            montant = debit > credit ? debit - credit : credit - debit;
          }

          const percent = montant !== 0 ? (montant * 100) / moyenne : 0;

          return { montant, percent };
        });

      const totalMontant = results.reduce((prev, curr) => {
        const montant = parseFloat(curr.montant + prev);
        return montant;
      }, 0);

      const totalPercent =
        totalMontant !== 0 ? (totalMontant * 100) / previsionEUR : 0;

      formatedData.push({
        compte: compt,
        parite,
        previsionUSD,
        previsionEUR,
        moyenne,
        percent: totalPercent,
        montant: totalMontant,
        data: results
      });
    }
  }

  return formatedData;
};

const getBilanData = (
  ecritureData,
  comptes,
  printData,
  field = 'compte',
  field2 = 'compte_code'
) => {
  let groups = {};
  let formatedData = [];

  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    groups[d[field]] = { compte: d, data: val };
  });

  // //console.log('group', group);
  for (const compte in groups) {
    if (Object.hasOwnProperty.call(groups, compte)) {
      const data = groups[compte].data;
      const compt = groups[compte].compte;

      const soldes = data.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? _.ceil(prev.debit + curr.montant_total_eur, 6)
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? _.ceil(prev.credit + curr.montant_total_eur, 6)
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const { debit, credit } = soldes;
      let solde = 0;

      if (compt.type === 'D') {
        solde = debit - credit;
      } else if (compt.type === 'C') {
        solde = credit - debit;
      } else {
        solde = debit > credit ? debit - credit : credit - debit;
      }

      formatedData.push({
        compte: compt,
        code: compt.compte,
        solde
      });
    }
  }

  let BILAN_OUTPUTS_DATA_COPY = [...BILAN_OUTPUTS_DATA];

  if (printData.entite?.code === 'A') {
    BILAN_OUTPUTS_DATA_COPY = [
      ...BILAN_OUTPUTS_DATA_COPY,
      {
        compte: '062',
        empty: 0
      },
      {
        compte: '064',
        empty: 0
      },
      {
        compte: '065',
        empty: 0
      },
      {
        compte: '066',
        empty: 0
      },
      {
        compte: '067',
        empty: 0
      },
      {
        compte: '071',
        empty: 0
      },
      {
        compte: '072',
        empty: 0
      },
      {
        compte: '073',
        empty: 0
      }
    ].map((d) => (d.compte === '014' ? { empty: 0, compte: '070' } : d));

    BILAN_OUTPUTS_DATA_COPY.splice(
      BILAN_OUTPUTS_DATA_COPY.findIndex((d) => d.compte === '016'),
      0,
      {
        compte: '061',
        empty: 0
      }
    );
  }

  const totalIncomes = BILAN_INCOMES_DATA.map(
    (v) => formatedData.find((d) => d.code === v.compte)?.solde || 0
  ).reduce((prev, curr) => _.ceil(curr + prev, 6), 0);

  const totalOutputs = BILAN_OUTPUTS_DATA_COPY.map(
    (v) => formatedData.find((d) => d.code === v.compte)?.solde || 0
  ).reduce((prev, curr) => _.ceil(curr + prev, 6), 0);

  let finalData = [
    {
      isTitle: true,
      libelle: 'REVENUES'
    },
    { empty: true }
  ];

  BILAN_INCOMES_DATA.forEach((v) => {
    const data = formatedData.find((d) => d.code === v.compte);

    finalData = [
      ...finalData,
      {
        code: data?.code,
        libelle: (data?.compte?.intitule || '').toUpperCase(),
        solde: data?.solde || 0
      },
      ...Array(v.empty || 0).fill({ empty: true })
    ];
  });

  finalData = [
    ...finalData,
    { empty: true },
    {
      isTotal: true,
      code: 'A',
      libelle: 'TOTAL REVENUS',
      solde: totalIncomes
    },
    { empty: true },
    {
      isTitle: true,
      libelle: 'SORTIES'
    },
    { empty: true }
  ];

  BILAN_OUTPUTS_DATA_COPY.forEach((v) => {
    const data = formatedData.find((d) => d.code === v.compte);
    finalData = [
      ...finalData,
      {
        code: data?.code,
        libelle: (data?.compte?.intitule || '').toUpperCase(),
        solde: data?.solde || 0
      },
      ...Array(v.empty || 0).fill({ empty: true })
    ];
  });

  finalData = [
    ...finalData,
    { empty: true },
    {
      isTotal: true,
      color: "tomato",
      code: 'B',
      libelle: 'TOTAL SORTIES',
      solde: totalOutputs
    },
    { empty: true },
    {
      code: 'C',
      libelle: 'ACTIF(+) PASSIF(-)',
      solde: _.ceil(totalIncomes - totalOutputs, 6)
    },
    { empty: true },
    {
      code: 'D',
      libelle: `RESTE AU 31 DÉCEMBRE ${printData?.exercice - 1}`,
      solde: formatedData.find((d) => d.code === '060')?.solde || 0
    },
    {
      code: 'E',
      libelle: (
        formatedData.find((d) => d.code === '058')?.compte?.intitule || ''
      ).toUpperCase(),
      solde: formatedData.find((d) => d.code === '058')?.solde || 0
    },
    {
      code: 'F',
      libelle: `RESUME REVENUES`,
      solde: totalIncomes
    },
    printData.entite?.code === 'A'
      ? null
      : {
          code: 'G',
          libelle: (
            formatedData.find((d) => d.code === '059')?.compte?.intitule || ''
          ).toUpperCase(),
          solde: formatedData.find((d) => d.code === '059')?.solde || 0
        },
    {
      code: 'H',
      libelle: `DON ÉCONOMAT GENERAL (BILLET AVION)`,
      solde: formatedData.find((d) => d.code === '055')?.solde || 0
    }
  ].filter((d) => !!d);

  finalData = [
    ...finalData,
    { empty: true },
    {
      isTotal: true,
      code: 'I',
      libelle: 'TOTAL REVENUES',
      solde: ['D', 'E', 'F', 'G', 'H']
        .map((v) => finalData.find((d) => d.code === v)?.solde || 0)
        .reduce((prev, curr) => _.ceil(curr + prev, 6), 0)
    },
    // { empty: true },
    // printData.entite?.code !== 'A'
    //   ? {
    //       code: 'J',
    //       libelle: 'DONNE A LA PROVINCE',
    //       solde: formatedData.find((d) => d.code === '029')?.solde || 0
    //     }
    //   : null,
    // {
    //   code: 'K',
    //   libelle: `RESUME SORTIES`,
    //   solde: totalOutputs
    // },
    //{ empty: true }
  ].filter((d) => !!d);

  finalData = [
    ...finalData,
    {
      isTotal: true,
      color: "tomato",
      code: 'L',
      libelle: 'TOTAL SORTIES',
       solde: totalOutputs
      // solde: ['J', 'K']
      //   .map((v) => finalData.find((d) => d.code === v)?.solde || 0)
      //   .reduce((prev, curr) => _.ceil(curr + prev, 6), 0)
    },
    { empty: true }
  ];

  finalData = [
    ...finalData,
    {
      isTotal: true,
      code: 'M',
      libelle: `RESTE AU 31 DÉCEMBRE ${printData?.exercice}`,
      solde: _.ceil(
        (finalData.find((d) => d.code === 'I')?.solde || 0) -
          (finalData.find((d) => d.code === 'L')?.solde || 0),
        6
      )
    }
  ];

  return finalData;
};
const groupJournalDetailed = (
  ecritureData,
  journals,
  printDate,
  field = 'compte',
  field2 = 'journal'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = {};
  journals.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      // //console.log('data :', data.length);
      // const dataBefore = data.filter((d) => {
      //   const currDate = new Date(d.date);
      //   const fromDate = new Date(date[0]);
      //   const toDate = new Date(date[1]);

      //   return isBefore(
      //     currDate.setHours(0, 0, 0, 0),
      //     fromDate.setHours(0, 0, 0, 0)
      //   );
      // });
      // //console.log('dataBefore :', dataBefore.length);
      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          (isAfter(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) &&
            isBefore(
              currDate.setHours(0, 0, 0, 0),
              toDate.setHours(0, 0, 0, 0)
            )) ||
          isEqual(
            currDate.setHours(0, 0, 0, 0),
            fromDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      // //console.log('dataAfter :', dataAfter.length);
      // const soldeBefore = dataBefore.reduce(
      //   (prev, curr) => {
      //     let currentTaux = 1;

      //     switch (printDate.devise) {
      //       case 'cdf_cdf':
      //         currentTaux = 1;
      //         break;
      //       case 'usd_cdf':
      //         currentTaux = curr.taux_usd;
      //         break;
      //       case 'eur_cdf':
      //         currentTaux = curr.taux_eur;
      //         break;
      //       case 'cfa_cdf':
      //         currentTaux = curr.taux_cfa;
      //         break;
      //       default:
      //         break;
      //     }

      //     const debit =
      //       curr.type === 'D'
      //         ? parseFloat(
      //             prev.debit + (curr.montant * curr.taux) / currentTaux
      //           )
      //         : prev.debit;
      //     const credit =
      //       curr.type === 'C'
      //         ? parseFloat(
      //             prev.credit + (curr.montant * curr.taux) / currentTaux
      //           )
      //         : prev.credit;

      //     return { debit, credit };
      //   },
      //   {
      //     debit: 0,
      //     credit: 0
      //   }
      // );

      const dataAfterFormated = dataAfter
        .map((d) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = d.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = d.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = d.taux_cfa;
              break;
            default:
              break;
          }
          d.montant = parseFloat((d.montant * d.taux) / currentTaux);
          return d;
        })
        .sort((a, b) => {
          const date1 = new Date(a.date);
          const date2 = new Date(b.date);
          return date1.getTime() - date2.getTime();
        });

      formatedData = {
        ...formatedData,
        [compte]: {
          // report: soldeBefore,
          compte: compt,
          data: dataAfterFormated
        }
      };
    }
  }

  return Object.values(formatedData).filter((v) => v.data && v.data.length);
  // .sort((a, b) => a.compte.ref_compte.localeCompare(b.compte.ref_compte));
};

const groupJournalDetailed2 = (ecritureData, printDate) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];

  const dataAfter = ecritureData.filter((d) => {
    const currDate = new Date(d.date);
    const fromDate = new Date(date[0]);
    const toDate = new Date(date[1]);

    return (
      (isAfter(currDate.setHours(0, 0, 0, 0), fromDate.setHours(0, 0, 0, 0)) &&
        isBefore(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))) ||
      isEqual(currDate.setHours(0, 0, 0, 0), fromDate.setHours(0, 0, 0, 0)) ||
      isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
    );
  });

  const dataAfterFormated = dataAfter
    .map((d) => {
      let currentTaux = 1;

      switch (printDate.devise) {
        case 'cdf':
          currentTaux = d.taux;
          break;
        case 'usd':
          currentTaux = d.parite;
          break;
        case 'eur':
          currentTaux = 1;
          break;
        default:
          break;
      }
      d.montant = parseFloat(d.montant_total_eur * currentTaux);
      return d;
    })
    .sort((a, b) => {
      const date1 = new Date(a.date);
      const date2 = new Date(b.date);
      return date1.getTime() - date2.getTime();
    });

  return dataAfterFormated;
};

const groupBalance = (data, level = 4, field = 'compt1') => {
  switch (level) {
    case 4: {
      return groupAlgo(
        1,
        groupAlgo(2, groupAlgo(3, groupAlgo(4, data, field), field), field),
        field
      );
    }
    case 3: {
      return groupAlgo(
        1,
        groupAlgo(2, groupAlgo(3, data, field), field),
        field
      );
    }
    case 2: {
      return groupAlgo(1, groupAlgo(2, data, field), field);
    }
    case 1: {
      return groupAlgo(1, data, field);
    }

    default:
      return groupAlgo(
        1,
        groupAlgo(2, groupAlgo(3, groupAlgo(4, data, field), field), field),
        field
      );
  }
};

const groupCompteByCls = (data, level = 4, field = 'ref_compte') => {
  switch (level) {
    case 4: {
      return groupAlgoCompte(
        4,
        groupAlgoCompte(
          3,
          groupAlgoCompte(2, groupAlgoCompte(1, data, field), field),
          field
        ),
        field
      );
    }
    case 3: {
      return groupAlgoCompte(
        3,
        groupAlgoCompte(2, groupAlgoCompte(1, data, field), field),
        field
      );
    }
    case 2: {
      return groupAlgoCompte(2, groupAlgoCompte(1, data, field), field);
    }
    case 1: {
      return groupAlgoCompte(1, data, field);
    }

    default:
      return groupAlgoCompte(
        4,
        groupAlgoCompte(
          3,
          groupAlgoCompte(2, groupAlgoCompte(1, data, field), field),
          field
        ),
        field
      );
  }
};

const getSortedCompte = (data, field = 'compt2') => {
  const group = {};
  let sortedData = [];
  data.forEach((d) => {
    if (group.hasOwnProperty(d[field])) {
      group[d[field]].push(d);
    } else {
      group[d[field]] = [d];
    }
  });

  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte];
      sortedData = [
        ...sortedData,
        ...data.sort((a, b) => a.compt1.localeCompare(b.compt1))
      ];
    }
  }
  return sortedData;
};

const getUniqueCompte = (data, field = 'ref_compte') => {
  const group = {};
  data.forEach((d) => {
    if (!group.hasOwnProperty(d[field])) {
      group[d[field]] = d;
    }
  });

  return Object.values(group);
};

const getRangeCompte = (data, range = [null, null], rangeField = 'compte') => {
  const start = range[0]
    ? data.findIndex((v) => v[rangeField] === range[0][rangeField])
    : 0;

  const end = range[1]
    ? data.findIndex((v) => v[rangeField] === range[1][rangeField])
    : data.length;

  return data.slice(start, end + 1);
};

const formatNumber = (number = 0, round = false) => {
  const n = round
    ? Math.round(number)
    : number < 1
    ? Math.round(number)
    : number;

  const formatStr = round ? '' : '.00';

  return numeral(n).format(`0,0${formatStr}`);
};

const groupByMouth = (data) => {
  const group = {};
  let groupedData = [];
  data.forEach((d) => {
    const date = new Date(d.date);
    const field = `${MOUTHS[date.getMonth()]} / ${date.getFullYear()}`;

    if (Object.hasOwnProperty.call(group, field)) {
      group[field].push(d);
    } else {
      group[field] = [d];
    }
  });

  for (const mouth in group) {
    if (Object.hasOwnProperty.call(group, mouth)) {
      const values = group[mouth];
      const soldes = values.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? parseFloat(curr.montant + prev.debit)
              : prev.debit;

          const credit =
            curr.type === 'C'
              ? parseFloat(curr.montant + prev.credit)
              : prev.credit;
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      groupedData = [
        ...groupedData,
        ...values,
        { libelle: mouth, ...soldes, classe: true }
      ];
    }
  }

  return groupedData;
};

const groupByMouthAndDay = (data) => {
  const group = {};
  const groupedByMouth = groupByMouth(data);
  let groupedData = [];
  groupedByMouth.forEach((d) => {
    if (d.classe) {
      group[d.libelle] = d;
    } else {
      const date = new Date(d.date);
      const field = `${date.getDate()} / ${
        MOUTHS[date.getMonth()]
      } / ${date.getFullYear()}`;

      if (Object.hasOwnProperty.call(group, field)) {
        group[field].push(d);
      } else {
        group[field] = [d];
      }
    }
  });

  for (const mouth in group) {
    if (Object.hasOwnProperty.call(group, mouth)) {
      let values = group[mouth];

      if (values.classe) {
        groupedData = [...groupedData, values];
      } else {
        values = values?.sort((a, b) => a.piece.localeCompare(b.piece));
        const soldes = values.reduce(
          (prev, curr) => {
            const debit =
              curr.type === 'D'
                ? parseFloat(curr.montant + prev.debit)
                : prev.debit;

            const credit =
              curr.type === 'C'
                ? parseFloat(curr.montant + prev.credit)
                : prev.credit;
            return { debit, credit };
          },
          {
            debit: 0,
            credit: 0
          }
        );

        let classeGroup = {
          libelle: mouth,
          ...soldes,
          classe: true,
          dayGroup: true
        };

        groupedData = [...groupedData, ...values, classeGroup];
      }
    }
  }

  return groupedData;
};

const groupByDay = (data) => {
  const group = {};
  let groupedData = [];
  data.forEach((d) => {
    const date = new Date(d.date);
    const field = `${date.getDate()} / ${
      MOUTHS[date.getMonth()]
    } / ${date.getFullYear()}`;

    if (Object.hasOwnProperty.call(group, field)) {
      group[field].push(d);
    } else {
      group[field] = [d];
    }
  });

  for (const mouth in group) {
    if (Object.hasOwnProperty.call(group, mouth)) {
      const values = group[mouth];
      const soldes = values.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? parseFloat(curr.montant + prev.debit)
              : prev.debit;

          const credit =
            curr.type === 'C'
              ? parseFloat(curr.montant + prev.credit)
              : prev.credit;
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      groupedData = [
        ...groupedData,
        ...values,
        { libelle: mouth, ...soldes, classe: true, dayGroup: true }
      ];
    }
  }

  return groupedData;
};

const groupByMouthWithReport = (data) => {
  const group = {};
  let groupedData = [];
  data.forEach((d) => {
    const date = new Date(d.date);
    const field = `${MOUTHS[date.getMonth()]} / ${date.getFullYear()}@${
      date.getMonth() + 1
    }-1-${date.getFullYear()}`;

    if (Object.hasOwnProperty.call(group, field)) {
      group[field].push(d);
    } else {
      group[field] = [d];
    }
  });

  for (const mouth in group) {
    if (Object.hasOwnProperty.call(group, mouth)) {
      const values = group[mouth];
      const fromDate = new Date(mouth.split('@')[1]);

      const dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        return isBefore(
          currDate.setHours(0, 0, 0, 0),
          fromDate.setHours(0, 0, 0, 0)
        );
      });

      const report = dataBefore.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? parseFloat(curr.montant_total_eur + prev.debit)
              : prev.debit;

          const credit =
            curr.type === 'C'
              ? parseFloat(curr.montant_total_eur + prev.credit)
              : prev.credit;
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const soldes = values.reduce(
        (prev, curr) => {
          let debit1, credit1;
          let debit2, credit2;
          let debit3, credit3;
          let debit4, credit4;

          if (curr.type === 'D') {
            debit1 = parseFloat(curr.montant_cdf + prev.debit1);
            credit1 = prev.credit1;

            debit2 = parseFloat(curr.montant_usd + prev.debit2);
            credit2 = prev.credit2;

            debit3 = parseFloat(curr.montant_eur + prev.debit3);
            credit3 = prev.credit3;

            debit4 = parseFloat(curr.montant_total_eur + prev.debit4);
            credit4 = prev.credit4;
          }

          if (curr.type === 'C') {
            credit1 = parseFloat(curr.montant_cdf + prev.credit1);
            debit1 = prev.debit1;

            credit2 = parseFloat(curr.montant_usd + prev.credit2);
            debit2 = prev.debit2;

            credit3 = parseFloat(curr.montant_eur + prev.credit3);
            debit3 = prev.debit3;

            credit4 = parseFloat(curr.montant_total_eur + prev.credit4);
            debit4 = prev.debit4;
          }

          return {
            debit1,
            credit1,
            debit2,
            credit2,
            debit3,
            credit3,
            debit4,
            credit4
          };
        },
        {
          debit1: 0,
          credit1: 0,
          debit2: 0,
          credit2: 0,
          debit3: 0,
          credit3: 0,
          debit4: 0,
          credit4: 0
        }
      );

      if (values && values.length) {
        groupedData = [
          ...groupedData,
          {
            soldes,
            report,
            date: mouth.split('@')[0],
            data: values
          }
        ];
      }
    }
  }

  return groupedData;
};
const groupByDayWithReport = (data) => {
  const group = {};
  let groupedData = [];
  data.forEach((d) => {
    const date = new Date(d.date);
    const field = `${date.getDate()} / ${
      MOUTHS[date.getMonth()]
    } / ${date.getFullYear()}@${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`;

    if (Object.hasOwnProperty.call(group, field)) {
      group[field].push(d);
    } else {
      group[field] = [d];
    }
  });

  for (const mouth in group) {
    if (Object.hasOwnProperty.call(group, mouth)) {
      const values = group[mouth];
      const fromDate = new Date(mouth.split('@')[1]);

      const dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        return isBefore(
          currDate.setHours(0, 0, 0, 0),
          fromDate.setHours(0, 0, 0, 0)
        );
      });

      const report = dataBefore.reduce(
        (prev, curr) => {
          const debit =
            curr.type === 'D'
              ? parseFloat(curr.montant_total_eur + prev.debit)
              : prev.debit;

          const credit =
            curr.type === 'C'
              ? parseFloat(curr.montant_total_eur + prev.credit)
              : prev.credit;
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const soldes = values.reduce(
        (prev, curr) => {
          let debit1, credit1;
          let debit2, credit2;
          let debit3, credit3;
          let debit4, credit4;

          if (curr.type === 'D') {
            debit1 = parseFloat(curr.montant_cdf + prev.debit1);
            credit1 = prev.credit1;

            debit2 = parseFloat(curr.montant_usd + prev.debit2);
            credit2 = prev.credit2;

            debit3 = parseFloat(curr.montant_eur + prev.debit3);
            credit3 = prev.credit3;

            debit4 = parseFloat(curr.montant_total_eur + prev.debit4);
            credit4 = prev.credit4;
          }

          if (curr.type === 'C') {
            credit1 = parseFloat(curr.montant_cdf + prev.credit1);
            debit1 = prev.debit1;

            credit2 = parseFloat(curr.montant_usd + prev.credit2);
            debit2 = prev.debit2;

            credit3 = parseFloat(curr.montant_eur + prev.credit3);
            debit3 = prev.debit3;

            credit4 = parseFloat(curr.montant_total_eur + prev.credit4);
            debit4 = prev.debit4;
          }

          return {
            debit1,
            credit1,
            debit2,
            credit2,
            debit3,
            credit3,
            debit4,
            credit4
          };
        },
        {
          debit1: 0,
          credit1: 0,
          debit2: 0,
          credit2: 0,
          debit3: 0,
          credit3: 0,
          debit4: 0,
          credit4: 0
        }
      );

      if (values && values.length) {
        groupedData = [
          ...groupedData,
          {
            soldes,
            report,
            date: mouth.split('@')[0],
            parite: values[0]?.parite,
            taux: values[0]?.taux,
            data: values
          }
        ];
      }
    }
  }

  return groupedData;
};

const getCompteSum = (data) => {
  const soldes = data.reduce(
    (prev, curr) => {
      const debit =
        curr.type === 'D' ? parseFloat(curr.montant + prev.debit) : prev.debit;

      const credit =
        curr.type === 'C'
          ? parseFloat(curr.montant + prev.credit)
          : prev.credit;
      return { debit, credit };
    },
    {
      debit: 0,
      credit: 0
    }
  );
  return soldes;
};

const getCompteSumBilan = (data) => {
  const soldes = data.reduce(
    (prev, curr) => {
      const montant1 = parseFloat(curr.montant1 + prev.montant1);
      const montant2 = parseFloat(curr.montant2 + prev.montant2);
      return { montant1, montant2 };
    },
    {
      montant1: 0,
      montant2: 0
    }
  );
  return soldes;
};

const getSumOfCompteByField = (data, fields = [], field2 = 'compt1') => {
  return fields
    .map((f) => data.find((d) => d[field2] === f))
    .reduce(
      (prev, curr) => {
        const currS1 = curr.solde1 || 0;
        const currS2 = curr.solde2 || 0;
        const currS3 = curr.solde3 || 0;
        const currS4 = curr.solde4 || 0;

        const solde1 = parseFloat(prev.solde1 + currS1);
        const solde2 = parseFloat(prev.solde2 + currS2);
        const solde3 = parseFloat(prev.solde3 + currS3);
        const solde4 = parseFloat(prev.solde4 + currS4);

        return { solde1, solde2, solde3, solde4 };
      },
      { solde1: 0, solde2: 0, solde3: 0, solde4: 0 }
    );
};

const getPositifSolde = (
  data,
  comptes = [],
  devise,
  type = 'D',
  field = 'ref_imputation'
) => {
  let choosenData = [];
  comptes.forEach((c) => {
    const filtredData = data.filter((v) => v[field]?.startsWith(c));
    const groupCompte = {};
    filtredData.forEach((d) => {
      if (groupCompte.hasOwnProperty(d['ref_imputation'])) {
        groupCompte[d['ref_imputation']].push(d);
      } else {
        groupCompte[d['ref_imputation']] = [d];
      }
    });

    for (const compt in groupCompte) {
      if (Object.hasOwnProperty.call(groupCompte, compt)) {
        const val = groupCompte[compt];
        const { debit, credit } = val.reduce(
          (prev, curr) => {
            let currentTaux = 1;
            switch (devise) {
              case 'cdf_cdf':
                currentTaux = 1;
                break;
              case 'usd_cdf':
                currentTaux = curr.taux_usd;
                break;
              case 'eur_cdf':
                currentTaux = curr.taux_eur;
                break;
              case 'cfa_cdf':
                currentTaux = curr.taux_cfa;
                break;
              default:
                break;
            }

            const debit =
              curr.type === 'D'
                ? parseFloat(
                    prev.debit + (curr.montant * curr.taux) / currentTaux
                  )
                : prev.debit;

            const credit =
              curr.type === 'C'
                ? parseFloat(
                    prev.credit + (curr.montant * curr.taux) / currentTaux
                  )
                : prev.credit;

            return { debit, credit };
          },
          {
            debit: 0,
            credit: 0
          }
        );

        const value = type === 'D' ? debit - credit : credit - debit;

        if (value >= 0) {
          console.log(compt, value);
          choosenData = [...choosenData, ...val];
        }
      }
    }
  });
  return choosenData;
};

const getPastPositifSolde = (
  data,
  comptes = [],
  type = 'D',
  field = 'compte'
) => {
  let choosenData = [];
  comptes.forEach((c) => {
    const filtredData = data.filter((v) => v[field]?.startsWith(c));
    filtredData.forEach((d) => {
      const { debit, credit } = d;
      const value = type === 'D' ? debit - credit : credit - debit;
      if (value >= 0) {
        choosenData = [...choosenData, d];
      }
    });
  });
  return choosenData;
};

const getResultCompte = (
  ecritureData,
  ecritureDataPast,
  comptes,
  printDate,
  field = 'ref_compte',
  field2 = 'ref_imputation'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = [];
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
    else group[d[field]] = { compte: d, data: [] };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      // const dataBefore = data.filter((d) => {
      //   const currDate = new Date(d.date);
      //   const fromDate = new Date(date[0]);
      //   const toDate = new Date(date[1]);
      //   return currDate.getDate() === 1 && currDate.getMonth() === 0;
      // });

      const dataBefore = ecritureDataPast.find((d) => d.compte === compte);

      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          isBefore(
            currDate.setHours(0, 0, 0, 0),
            toDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      // //console.log('dataAfter :', dataAfter.length);
      // const soldeBefore = dataBefore.reduce(
      //   (prev, curr) => {
      //     let currentTaux = 1;

      //     switch (printDate.devise) {
      //       case 'cdf_cdf':
      //         currentTaux = 1;
      //         break;
      //       case 'usd_cdf':
      //         currentTaux = curr.taux_usd;
      //         break;
      //       case 'eur_cdf':
      //         currentTaux = curr.taux_eur;
      //         break;
      //       case 'cfa_cdf':
      //         currentTaux = curr.taux_cfa;
      //         break;
      //       default:
      //         break;
      //     }

      //     const debit =
      //       curr.type === 'D'
      //         ? parseFloat(
      //             prev.debit + (curr.montant * curr.taux) / currentTaux
      //           )
      //         : prev.debit;
      //     const credit =
      //       curr.type === 'C'
      //         ? parseFloat(
      //             prev.credit + (curr.montant * curr.taux) / currentTaux
      //           )
      //         : prev.credit;

      //     return { debit, credit };
      //   },
      //   {
      //     debit: 0,
      //     credit: 0
      //   }
      // );

      const soldeAfter = dataAfter.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      //PASSIF - T RESULT
      formatedData.push({
        solde1: soldeAfter.credit - soldeAfter.debit,
        solde2: dataBefore ? dataBefore.credit - dataBefore.debit : 0,
        intitule: compt?.intitule || '',
        note: compt?.note || '',
        signe: compt?.signe || '',
        compt1: compte || '',
        compt2: compt?.ref_compte || ''
      });

      //ACTIF
      // formatedData.push({
      //   solde1: soldeAfter.debit - soldeAfter.credit,
      //   solde2: soldeBefore.debit - soldeBefore.credit,
      //   intitule: compt?.intitule || '',
      //   compt1: compte || '',
      //   compt2: compt?.ref_compte || ''
      // });

      //  formatedData.push({
      //    solde1:
      //      soldeAfter.debit > soldeAfter.credit
      //        ? soldeAfter.debit - soldeAfter.credit
      //        : soldeAfter.credit - soldeAfter.debit,
      //    solde2:
      //      soldeBefore.debit > soldeBefore.credit
      //        ? soldeBefore.debit - soldeBefore.credit
      //        : soldeBefore.credit - soldeBefore.debit,
      //    intitule: compt?.intitule || '',
      //    compt1: compte || '',
      //    compt2: compt?.ref_compte || ''
      //  });
    }
  }
  return formatedData;
};

const getResultCompteBilanPassif = (
  ecritureData,
  ecritureDataPast,
  comptes,
  printDate,
  field = 'ref_compte',
  field2 = 'ref_imputation'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = [];
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
    else group[d[field]] = { compte: d, data: [] };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      let dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return currDate.getDate() === 1 && currDate.getMonth() === 0;
      });

      let dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          isBefore(
            currDate.setHours(0, 0, 0, 0),
            toDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });

      if (compte === 'DK') {
        dataAfter = getPositifSolde(
          ecritureData,
          ['42', '43', '44'],
          printDate.devise,
          'C',
          'ref_imputation'
        );
        dataBefore = getPastPositifSolde(
          ecritureDataPast,
          ['42', '43', '44'],
          'C',
          'compte'
        );
      } else if (compte === 'DM') {
        dataAfter = ecritureData.filter(
          (d) => !d['ref_imputation']?.startsWith('479')
        );
        dataBefore = ecritureDataPast.filter(
          (d) => !d['compte']?.startsWith('479')
        );
        dataAfter = getPositifSolde(
          dataAfter,
          ['185', '45', '46', '47'],
          printDate.devise,
          'C',
          'ref_imputation'
        );
        dataBefore = getPastPositifSolde(
          dataBefore,
          ['185', '45', '46', '47'],
          'C',
          'compte'
        );
      } else if (compte === 'DR') {
        dataAfter = getPositifSolde(
          ecritureData,
          ['52', '53', '561', '566'],
          printDate.devise,
          'C',
          'ref_imputation'
        );
        dataBefore = getPastPositifSolde(
          ecritureDataPast,
          ['52', '53', '561', '566'],
          'C',
          'compte'
        );
      }
      // //console.log('dataAfter :', dataAfter.length);
      const soldeBefore = dataBefore.reduce(
        (prev, curr) => {
          let currentTaux = 1;
          let debit = 0;
          let credit = 0;
          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          if (curr.hasOwnProperty('solde')) {
            debit = parseFloat(prev.debit + curr.debit);
            credit = parseFloat(prev.credit + curr.credit);
          } else {
            debit =
              curr.type === 'D'
                ? parseFloat(
                    prev.debit + (curr.montant * curr.taux) / currentTaux
                  )
                : prev.debit;
            credit =
              curr.type === 'C'
                ? parseFloat(
                    prev.credit + (curr.montant * curr.taux) / currentTaux
                  )
                : prev.credit;
          }

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      let soldeAfter = dataAfter.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      if (compte === 'CJ') {
        soldeAfter = { debit: 0, credit: 0 };
      }

      formatedData.push({
        solde1: soldeAfter.credit - soldeAfter.debit,
        solde2: soldeBefore.credit - soldeBefore.debit,
        intitule: compt?.intitule || '',
        note: compt?.note || '',
        compt1: compte || '',
        compt2: compt?.ref_compte || ''
      });
    }
  }
  return formatedData;
};

const getResultCompteBilanActif = (
  ecritureData,
  ecritureDataPast,
  comptes,
  printDate,
  field = 'ref_compte',
  field2 = 'ref_imputation'
) => {
  const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = [];
  comptes.forEach((d) => {
    const val = ecritureData.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
    else group[d[field]] = { compte: d, data: [] };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;
      let brutData = [];
      let amortData = [];
      let brutPastData = [];
      let amortPastData = [];

      switch (compte) {
        case 'AE': {
          brutData = ecritureData.filter((v) => {
            return (
              v['ref_imputation']?.startsWith('211') ||
              v['ref_imputation']?.startsWith('2181') ||
              v['ref_imputation']?.startsWith('2191')
            );
          });
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2811') ||
              v['ref_imputation']?.startsWith('2818') ||
              v['ref_imputation']?.startsWith('2911') ||
              v['ref_imputation']?.startsWith('2918') ||
              v['ref_imputation']?.startsWith('2919')
          );
          brutPastData = ecritureDataPast.filter((v) => {
            return (
              v['compte']?.startsWith('211') ||
              v['compte']?.startsWith('2181') ||
              v['compte']?.startsWith('2191')
            );
          });
          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2811') ||
              v['compte']?.startsWith('2818') ||
              v['compte']?.startsWith('2911') ||
              v['compte']?.startsWith('2918') ||
              v['compte']?.startsWith('2919')
          );
          break;
        }
        case 'AF': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('212') ||
              v['ref_imputation']?.startsWith('213') ||
              v['ref_imputation']?.startsWith('214') ||
              v['ref_imputation']?.startsWith('2193')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2812') ||
              v['ref_imputation']?.startsWith('2813') ||
              v['ref_imputation']?.startsWith('2814') ||
              v['ref_imputation']?.startsWith('2912') ||
              v['ref_imputation']?.startsWith('2913') ||
              v['ref_imputation']?.startsWith('2914') ||
              v['ref_imputation']?.startsWith('2919')
          );

          brutPastData = ecritureDataPast.filter((v) => {
            return (
              v['compte']?.startsWith('212') ||
              v['compte']?.startsWith('213') ||
              v['compte']?.startsWith('214') ||
              v['compte']?.startsWith('2193')
            );
          });

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2812') ||
              v['compte']?.startsWith('2813') ||
              v['compte']?.startsWith('2814') ||
              v['compte']?.startsWith('2912') ||
              v['compte']?.startsWith('2913') ||
              v['compte']?.startsWith('2914') ||
              v['compte']?.startsWith('2919')
          );
          break;
        }
        case 'AG': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('215') ||
              v['ref_imputation']?.startsWith('216')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2815') ||
              v['ref_imputation']?.startsWith('2816') ||
              v['ref_imputation']?.startsWith('2915') ||
              v['ref_imputation']?.startsWith('2916')
          );
          brutPastData = ecritureDataPast.filter((v) => {
            return (
              v['compte']?.startsWith('215') || v['compte']?.startsWith('216')
            );
          });

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2815') ||
              v['compte']?.startsWith('2816') ||
              v['compte']?.startsWith('2915') ||
              v['compte']?.startsWith('2916')
          );
          break;
        }
        case 'AH': {
          brutData = ecritureData.filter(
            (v) =>
              (v['ref_imputation']?.startsWith('217') ||
                v['ref_imputation']?.startsWith('218') ||
                v['ref_imputation']?.startsWith('2198')) &&
              !v['ref_imputation']?.startsWith('2181')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2817') ||
              v['ref_imputation']?.startsWith('2818') ||
              v['ref_imputation']?.startsWith('2917') ||
              v['ref_imputation']?.startsWith('2918') ||
              v['ref_imputation']?.startsWith('2919')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              (v['compte']?.startsWith('217') ||
                v['compte']?.startsWith('218') ||
                v['compte']?.startsWith('2198')) &&
              !v['compte']?.startsWith('2181')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2817') ||
              v['compte']?.startsWith('2818') ||
              v['compte']?.startsWith('2917') ||
              v['compte']?.startsWith('2918') ||
              v['compte']?.startsWith('2919')
          );
          break;
        }
        case 'AJ': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('22')
          );

          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('282') ||
              v['ref_imputation']?.startsWith('292')
          );

          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('22')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('282') || v['compte']?.startsWith('292')
          );
          break;
        }
        case 'AK': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('231') ||
              v['ref_imputation']?.startsWith('232') ||
              v['ref_imputation']?.startsWith('233') ||
              v['ref_imputation']?.startsWith('237') ||
              v['ref_imputation']?.startsWith('2391')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2831') ||
              v['ref_imputation']?.startsWith('2832') ||
              v['ref_imputation']?.startsWith('2833') ||
              v['ref_imputation']?.startsWith('2837') ||
              v['ref_imputation']?.startsWith('2931') ||
              v['ref_imputation']?.startsWith('2932') ||
              v['ref_imputation']?.startsWith('2933') ||
              v['ref_imputation']?.startsWith('2937') ||
              v['ref_imputation']?.startsWith('2939')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('231') ||
              v['compte']?.startsWith('232') ||
              v['compte']?.startsWith('233') ||
              v['compte']?.startsWith('237') ||
              v['compte']?.startsWith('2391')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2831') ||
              v['compte']?.startsWith('2832') ||
              v['compte']?.startsWith('2833') ||
              v['compte']?.startsWith('2837') ||
              v['compte']?.startsWith('2931') ||
              v['compte']?.startsWith('2932') ||
              v['compte']?.startsWith('2933') ||
              v['compte']?.startsWith('2937') ||
              v['compte']?.startsWith('2939')
          );
          break;
        }
        case 'AL': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('234') ||
              v['ref_imputation']?.startsWith('235') ||
              v['ref_imputation']?.startsWith('238') ||
              v['ref_imputation']?.startsWith('2392') ||
              v['ref_imputation']?.startsWith('2393')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2834') ||
              v['ref_imputation']?.startsWith('2835') ||
              v['ref_imputation']?.startsWith('2838') ||
              v['ref_imputation']?.startsWith('2934') ||
              v['ref_imputation']?.startsWith('2935') ||
              v['ref_imputation']?.startsWith('2938') ||
              v['ref_imputation']?.startsWith('2939')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('234') ||
              v['compte']?.startsWith('235') ||
              v['compte']?.startsWith('238') ||
              v['compte']?.startsWith('2392') ||
              v['compte']?.startsWith('2393')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2834') ||
              v['compte']?.startsWith('2835') ||
              v['compte']?.startsWith('2838') ||
              v['compte']?.startsWith('2934') ||
              v['compte']?.startsWith('2935') ||
              v['compte']?.startsWith('2938') ||
              v['compte']?.startsWith('2939')
          );
          break;
        }
        case 'AM': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('24') &&
              !v['ref_imputation']?.startsWith('245') &&
              !v['ref_imputation']?.startsWith('2495')
          );
          amortData = ecritureData.filter(
            (v) =>
              (v['ref_imputation']?.startsWith('284') ||
                v['ref_imputation']?.startsWith('294') ||
                v['ref_imputation']?.startsWith('2949')) &&
              !v['ref_imputation']?.startsWith('2845') &&
              !v['ref_imputation']?.startsWith('2945') &&
              !v['ref_imputation']?.startsWith('2949')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('24') &&
              !v['compte']?.startsWith('245') &&
              !v['compte']?.startsWith('2495')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              (v['compte']?.startsWith('284') ||
                v['compte']?.startsWith('294') ||
                v['compte']?.startsWith('2949')) &&
              !v['compte']?.startsWith('2845') &&
              !v['compte']?.startsWith('2945') &&
              !v['compte']?.startsWith('2949')
          );
          break;
        }
        case 'AN': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('245') ||
              v['ref_imputation']?.startsWith('2495')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2845') ||
              v['ref_imputation']?.startsWith('2945') ||
              v['ref_imputation']?.startsWith('2949')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('245') || v['compte']?.startsWith('2495')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2845') ||
              v['compte']?.startsWith('2945') ||
              v['compte']?.startsWith('2949')
          );
          break;
        }
        case 'AP': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('251') ||
              v['ref_imputation']?.startsWith('252')
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('2951') ||
              v['ref_imputation']?.startsWith('2952')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('251') || v['compte']?.startsWith('252')
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('2951') || v['compte']?.startsWith('2952')
          );
          break;
        }
        case 'AR': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('26')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('296')
          );
          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('26')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('296')
          );
          break;
        }
        case 'AS': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('27')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('297')
          );
          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('27')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('297')
          );
          break;
        }
        case 'BA': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('485') ||
              v['ref_imputation']?.startsWith('488')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('498')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('485') || v['compte']?.startsWith('488')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('498')
          );
          break;
        }
        case 'BB': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('31') ||
              v['ref_imputation']?.startsWith('32') ||
              v['ref_imputation']?.startsWith('33') ||
              v['ref_imputation']?.startsWith('34') ||
              v['ref_imputation']?.startsWith('35') ||
              v['ref_imputation']?.startsWith('36') ||
              v['ref_imputation']?.startsWith('37') ||
              v['ref_imputation']?.startsWith('38')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('39')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('31') ||
              v['compte']?.startsWith('32') ||
              v['compte']?.startsWith('33') ||
              v['compte']?.startsWith('34') ||
              v['compte']?.startsWith('35') ||
              v['compte']?.startsWith('36') ||
              v['compte']?.startsWith('37') ||
              v['compte']?.startsWith('38')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('39')
          );
          break;
        }
        case 'BH': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('409')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('490')
          );

          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('409')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('490')
          );
          break;
        }
        case 'BI': {
          brutData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('41') &&
              !v['ref_imputation']?.startsWith('419')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('491')
          );
          brutPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('41') && !v['compte']?.startsWith('419')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('491')
          );
          break;
        }
        case 'BJ': {
          const filtredData = ecritureData.filter(
            (v) => !v['ref_imputation']?.startsWith('478')
          );

          const filtredPastData = ecritureDataPast.filter(
            (v) => !v['compte']?.startsWith('478')
          );

          brutData = getPositifSolde(
            filtredData,
            ['185', '42', '43', '44', '45', '46', '47'],
            printDate.devise,
            'D',
            'ref_imputation'
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('492') ||
              v['ref_imputation']?.startsWith('493') ||
              v['ref_imputation']?.startsWith('494') ||
              v['ref_imputation']?.startsWith('495') ||
              v['ref_imputation']?.startsWith('496') ||
              v['ref_imputation']?.startsWith('497')
          );

          brutPastData = getPastPositifSolde(
            filtredPastData,
            ['185', '42', '43', '44', '45', '46', '47'],
            'D',
            'compte'
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('492') ||
              v['compte']?.startsWith('493') ||
              v['compte']?.startsWith('494') ||
              v['compte']?.startsWith('495') ||
              v['compte']?.startsWith('496') ||
              v['compte']?.startsWith('497')
          );
          break;
        }
        case 'BQ': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('50')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('590')
          );
          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('50')
          );

          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('590')
          );
          break;
        }
        case 'BR': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('51')
          );
          amortData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('591')
          );
          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('51')
          );
          amortPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('591')
          );
          break;
        }
        case 'BS': {
          brutData = getPositifSolde(
            ecritureData,
            ['52', '53', '54', '55', '57', '581', '582'],
            printDate.devise,
            'D',
            'ref_imputation'
          );
          amortData = ecritureData.filter(
            (v) =>
              v['ref_imputation']?.startsWith('592') ||
              v['ref_imputation']?.startsWith('593') ||
              v['ref_imputation']?.startsWith('594')
          );
          brutPastData = getPastPositifSolde(
            ecritureDataPast,
            ['52', '53', '54', '55', '57', '581', '582'],
            'D',
            'compte'
          );

          amortPastData = ecritureDataPast.filter(
            (v) =>
              v['compte']?.startsWith('592') ||
              v['compte']?.startsWith('593') ||
              v['compte']?.startsWith('594')
          );
          break;
        }
        case 'BU': {
          brutData = ecritureData.filter((v) =>
            v['ref_imputation']?.startsWith('478')
          );
          brutPastData = ecritureDataPast.filter((v) =>
            v['compte']?.startsWith('478')
          );
          break;
        }
        default:
          break;
      }
      brutData = brutData.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          isBefore(
            currDate.setHours(0, 0, 0, 0),
            toDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });
      amortData = amortData.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          isBefore(
            currDate.setHours(0, 0, 0, 0),
            toDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });
      const dataBefore = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return currDate.getDate() === 1 && currDate.getMonth() === 0;
      });
      const dataAfter = data.filter((d) => {
        const currDate = new Date(d.date);
        const fromDate = new Date(date[0]);
        const toDate = new Date(date[1]);

        return (
          isBefore(
            currDate.setHours(0, 0, 0, 0),
            toDate.setHours(0, 0, 0, 0)
          ) ||
          isEqual(currDate.setHours(0, 0, 0, 0), toDate.setHours(0, 0, 0, 0))
        );
      });
      const brutSolde = brutData.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }

          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );
      const brutPastSolde = brutPastData.reduce(
        (prev, curr) => {
          const debit = parseFloat(prev.debit + curr.debit);
          const credit = parseFloat(prev.credit + curr.credit);
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );
      const amortSolde = amortData.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }

          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );
      const amortPastSolde = amortPastData.reduce(
        (prev, curr) => {
          const debit = parseFloat(prev.debit + curr.debit);
          const credit = parseFloat(prev.credit + curr.credit);
          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );
      const soldeBefore = dataBefore.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }

          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );
      const soldeAfter = dataAfter.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      // const solde2 = soldeBefore.debit - soldeBefore.credit;

      // N
      const solde3 = Math.round(brutSolde.debit - brutSolde.credit);
      const solde4 = Math.round(amortSolde.credit - amortSolde.debit);
      const solde1 = Math.round(solde3 - solde4);

      // N-1
      const solde3Past = Math.round(brutPastSolde.debit - brutPastSolde.credit);
      const solde4Past = Math.round(
        amortPastSolde.credit - amortPastSolde.debit
      );
      const solde2 = Math.round(solde3Past - solde4Past);

      const newData = {
        solde1,
        solde2,
        solde3,
        solde4,
        intitule: compt?.intitule || '',
        note: compt?.note || '',
        compt1: compte || '',
        compt2: compt?.ref_compte || ''
      };

      // const newData = {
      //   solde1: soldeAfter.debit - soldeAfter.credit,
      //   solde2: soldeBefore.debit - soldeBefore.credit,
      //   solde3: brutSolde.debit - brutSolde.credit,
      //   solde4: amortSolde.debit - amortSolde.credit,
      //   intitule: compt?.intitule || '',
      //   compt1: compte || '',
      //   compt2: compt?.ref_compte || ''
      // };

      formatedData.push(newData);
    }
  }
  return formatedData;
};

const getSumOfResultCompte = (sumComptes, formatedData) => {
  sumComptes.forEach((c) => {
    switch (c.compte) {
      case 'XA': {
        const sum = getSumOfCompteByField(formatedData, ['TA', 'RA', 'RB']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XB': {
        const sum = getSumOfCompteByField(formatedData, [
          'TA',
          'TB',
          'TC',
          'TD'
        ]);

        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XC': {
        const sum = getSumOfCompteByField(formatedData, [
          'XB',
          'RA',
          'RB',
          'TE',
          'TF',
          'TG',
          'TH',
          'TI',
          'RC',
          'RD',
          'RE',
          'RF',
          'RG',
          'RH',
          'RI',
          'RJ'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XD': {
        const sum = getSumOfCompteByField(formatedData, ['XC', 'RK']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XE': {
        const sum = getSumOfCompteByField(formatedData, ['XD', 'TJ', 'RL']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XF': {
        const sum = getSumOfCompteByField(formatedData, [
          'TK',
          'TL',
          'TM',
          'RM',
          'RN'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XG': {
        const sum = getSumOfCompteByField(formatedData, ['XE', 'XF']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XH': {
        const sum = getSumOfCompteByField(formatedData, [
          'TN',
          'TO',
          'RO',
          'RP'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'XI': {
        const sum = getSumOfCompteByField(formatedData, [
          'XG',
          'XH',
          'RQ',
          'RS'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          sum: true
        });
        break;
      }

      default:
        break;
    }
  });

  return formatedData;
};

const getSumOfBilanActif = (sumComptes, formatedData) => {
  sumComptes.forEach((c) => {
    let sum = {};
    switch (c.compte) {
      case 'AD': {
        sum = getSumOfCompteByField(formatedData, ['AE', 'AF', 'AG', 'AH']);
        break;
      }
      case 'AI': {
        sum = getSumOfCompteByField(formatedData, [
          'AJ',
          'AK',
          'AL',
          'AM',
          'AN',
          'AP'
        ]);
        break;
      }
      case 'AQ': {
        sum = getSumOfCompteByField(formatedData, ['AR', 'AS']);
        break;
      }
      case 'AZ': {
        sum = getSumOfCompteByField(formatedData, ['AD', 'AI', 'AQ']);
        break;
      }
      case 'BG': {
        sum = getSumOfCompteByField(formatedData, ['BH', 'BI', 'BJ']);
        break;
      }
      case 'BK': {
        sum = getSumOfCompteByField(formatedData, ['BG', 'BB', 'BA']);
        break;
      }
      case 'BT': {
        sum = getSumOfCompteByField(formatedData, ['BQ', 'BR', 'BS']);
        break;
      }
      case 'BZ': {
        sum = getSumOfCompteByField(formatedData, ['AZ', 'BK', 'BT', 'BU']);
        break;
      }
      default:
        break;
    }

    formatedData.splice(c.index, 0, {
      ...sum,
      intitule: c?.intitule || '',
      note: c?.note || '',
      compt1: c?.compte,
      sum: true
    });
  });

  return formatedData;
};

const getSumOfBilanPassif = (sumComptes, formatedData) => {
  sumComptes.forEach((c) => {
    switch (c.compte) {
      case 'CP': {
        const sum = getSumOfCompteByField(formatedData, [
          'CA',
          'CB',
          'CD',
          'CE',
          'CF',
          'CG',
          'CH',
          'CJ',
          'CL',
          'CM'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          note: '',
          compt1: c.compte,
          sum: true
        });
        break;
      }
      case 'DD': {
        const sum = getSumOfCompteByField(formatedData, ['DA', 'DB', 'DC']);

        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          note: '',
          sum: true
        });
        break;
      }
      case 'DF': {
        const sum = getSumOfCompteByField(formatedData, ['CP', 'DD']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          note: '',
          sum: true
        });
        break;
      }
      case 'DP': {
        const sum = getSumOfCompteByField(formatedData, [
          'DH',
          'DI',
          'DJ',
          'DK',
          'DM',
          'DN'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          note: '',
          sum: true
        });
        break;
      }
      case 'DT': {
        const sum = getSumOfCompteByField(formatedData, ['DQ', 'DR']);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          note: '',
          sum: true
        });
        break;
      }
      case 'DZ': {
        const sum = getSumOfCompteByField(formatedData, [
          'DF',
          'DP',
          'DT',
          'DV'
        ]);
        formatedData.splice(c.index, 0, {
          ...sum,
          intitule: c.intitule || '',
          compt1: c.compte,
          note: '',
          sum: true
        });
        break;
      }
      default:
        break;
    }
  });

  return formatedData;
};

const groupCompteByNote = (
  data,
  comptes,
  printDate,
  field = 'ref_compte',
  field2 = 'ref_imputation'
) => {
  // const date = [printDate.date.fromDate, printDate.date.toDate];
  let group = {};
  let formatedData = [];
  let notes = [];
  comptes.forEach((d) => {
    const val = data.filter((v) => v[field2] === d[field]);
    if (val && val.length) group[d[field]] = { compte: d, data: val };
  });

  // //console.log('group', group);
  for (const compte in group) {
    if (Object.hasOwnProperty.call(group, compte)) {
      const data = group[compte].data;
      const compt = group[compte].compte;

      const soldes = data.reduce(
        (prev, curr) => {
          let currentTaux = 1;

          switch (printDate.devise) {
            case 'cdf_cdf':
              currentTaux = 1;
              break;
            case 'usd_cdf':
              currentTaux = curr.taux_usd;
              break;
            case 'eur_cdf':
              currentTaux = curr.taux_eur;
              break;
            case 'cfa_cdf':
              currentTaux = curr.taux_cfa;
              break;
            default:
              break;
          }
          const debit =
            curr.type === 'D'
              ? parseFloat(
                  prev.debit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.debit;
          const credit =
            curr.type === 'C'
              ? parseFloat(
                  prev.credit + (curr.montant * curr.taux) / currentTaux
                )
              : prev.credit;

          return { debit, credit };
        },
        {
          debit: 0,
          credit: 0
        }
      );

      const soldeCompte =
        soldes.debit > soldes.credit
          ? soldes.debit - soldes.credit
          : soldes.credit - soldes.debit;

      formatedData.push({
        ...soldes,
        solde: soldeCompte,
        intitule: compt?.intitule || '',
        compte: compte || '',
        compt2: compt?.ref_compte || ''
      });
    }
  }

  TB_COR_NOTE.forEach((note) => {
    const values = TB_COR_VALUES.filter((v) => v.note === note.note);

    if (values && values.length) {
      const noteData = values
        .map((value) => {
          const data = formatedData.filter((fd) =>
            fd.compte?.startsWith(value.compte)
          );
          return data && data.length ? { ...value, data } : null;
        })
        .filter((d) => d !== null);

      notes.push({ ...note, data: noteData });
    }
  });

  return notes;
};

module.exports = {
  getComptesStartsWith,
  groupBalance,
  getCurrency,
  getWritingsSum,
  groupCompte,
  totalSum,
  getUniqueCompte,
  getRangeCompte,
  formatNumber,
  groupCompteDetailed,
  groupCompteDaily,
  groupCompteBudget,
  groupJournalDetailed,
  groupByMouth,
  groupByDay,
  groupByMouthAndDay,
  groupByDayWithReport,
  groupByMouthWithReport,
  getCompteSum,
  groupJournalDetailed2,
  groupCompteBilan,
  getBilanData,
  getCompteSumBilan,
  groupCompteByCls,
  getResultCompte,
  getResultCompteBilanPassif,
  getResultCompteBilanActif,
  getSumOfResultCompte,
  getSumOfBilanActif,
  getSumOfBilanPassif,
  groupCompteByNote
};
