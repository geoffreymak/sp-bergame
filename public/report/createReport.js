const createTable = require('./createTable');
const createPdf = require('./createPdf');

const createReport = async (data) => {
  try {
    await createTable(data.type, data.data);
    const pdfPath = await createPdf(data);
    return pdfPath;
  } catch (error) {
    console.log('Error generating PDF', error);
    return false;
  }
};

module.exports = createReport;
