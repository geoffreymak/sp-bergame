/* eslint-disable  */
const moment = require('moment');

const dbFactoring = (data, exercice) => {
  const newData = data
    .map((d) => {
      if (!d.date) return null;
      const year = d.date?.substr(0, 4);
      const mounth = d.date?.substr(4, 2);
      const day = d.date?.substr(6);
      const date = `${mounth}-${day}-${year}`;
      d.date = new Date(date).toISOString();
      d.exercice = exercice;
      d.type = d.type.toUpperCase();
      return d;
    })
    .filter((d) => d !== null);

  return newData;
};

module.exports = dbFactoring;
