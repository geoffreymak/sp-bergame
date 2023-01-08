/* eslint-disable  */
const moment = require('moment');

const dbFactoring = (data) => {
  const newData = data.map((d) => {
    d.date = moment(d.DAMOUV).format();
    d.piece = d.NOFA;
    d.compte = d.COMPT2;
    d.imputation = d.compt1;
    d.ref_imputation = d.COMPTE;
    d.correspond = d.DIOC;
    d.journal = d.JRNL;
    d.libelle = d.LIBELLE;
    d.taux_usd = d.TAUX;
    d.taux_eur = d.PARITE;
    d.taux_cfa = d.Tauxcfa;
    d.user = d.utilisateur;
    d.type = d.TYPE;
    d.site = d.PROV;

    if (d.MON === 'F') {
      d.devise = 'cdf_cdf';
      d.taux = 1;
      d.montant = d.MONTANTfc;
    } else if (d.MON === 'E') {
      d.devise = 'eur_cdf';
      d.taux = d.PARITE;
      d.montant = d.MONTANTeuro;
    } else if (d.MON === 'D') {
      d.devise = 'cfa_cdf';
      d.taux = d.Tauxcfa;
      d.montant = d.MONTANTcfa;
    } else if (d.MON === '$') {
      d.devise = 'usd_cdf';
      d.taux = d.TAUX;
      d.montant = d.MONTANTdol;
    }

    return d;
  });

  return newData;
};

module.exports = dbFactoring;
