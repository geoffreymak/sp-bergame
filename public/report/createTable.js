const table = require('./tables');

const createTable = async (type, data) => {
  await table[type](data);
};
module.exports = createTable;
