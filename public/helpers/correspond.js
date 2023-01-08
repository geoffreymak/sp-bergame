/* eslint-disable operator-linebreak */
const compteModel = require('../models/comptes');
const ecritureModel = require('../models/ecritures');

const dbFactoring = async () => {
  const comptesData = await compteModel.find().lean();
  const ecritureData = await ecritureModel.find().lean();

  ecritureData
    .map((e) => {
      const currCompte = comptesData.find(
        (c) => c['ref_compte'] === e['ref_imputation']
      );
      const correspond = currCompte?.correspond || '';
      return { ...e, correspond };
    })
    .forEach(async (d) => {
      await ecritureModel.updateOne({ uuid: d.uuid }, d);
    });
};

module.exports = dbFactoring;
