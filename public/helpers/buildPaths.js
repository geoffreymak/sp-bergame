const path = require('path');

const CWD = process.cwd();

const buildPaths = {
  buildPathHtml: path.resolve(path.join(CWD, 'data.html')),
  buildPathPdf: path.resolve(path.join(CWD, 'data.pdf'))
};
module.exports = buildPaths;
