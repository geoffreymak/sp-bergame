/*eslint-disable */
import { ceil } from 'lodash';

export const getComptesStartsWith = (
  comptes = [],
  searchString,
  field = 'compte'
) => {
  return comptes.filter((compte) => compte[field].startsWith(searchString));
};

export const getCurrency = (currency) => {
  switch (currency) {
    case 'cdf_cdf':
      return 'CDF';
    case 'usd_cdf':
      return 'USD';
    case 'eur_cdf':
      return 'EUR';
    case 'cfa_cdf':
      return 'CFA';
    case 'CDF':
      return 'cdf_cdf';
    case 'USD':
      return 'usd_cdf';
    case 'EUR':
      return 'eur_cdf';
    case 'CFA':
      return 'cfa_cdf';
    default:
      return '';
  }
};

export const getWritingsSum = (writing = [], type = 'D') => {
  return writing
    .filter((v) => v.type === type)
    .reduce((prev, curr) => {
      return ceil(prev + ceil(curr.montant_total_eur, 2), 2);
    }, 0);
};

export const getUniqueCompte = (data, field = 'ref_compte') => {
  const group = {};
  data.forEach((d) => {
    if (!group.hasOwnProperty(d[field])) {
      group[d[field]] = d;
    }
  });

  return Object.values(group);
};
