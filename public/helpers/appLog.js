/*eslint-disable */

const { EOL } = require('os');
const fs = require('fs');
const path = require('path');
const data = require('./data');

const CWD = process.cwd();

// function to save app logs, it writes to console and to a file.
// writing to a file is handy because when running the app from normal
// executable there is no console to see logs
module.exports = function appLog(level, message) {
  const origMsg = message;

  // eslint-disable-next-line no-param-reassign
  message += EOL;

  if (level === 'info') {
    console.log(origMsg);
    fs.appendFileSync(path.join(CWD, 'app-info.log'), message);
  } else if (level === 'error') {
    console.error(origMsg);
    fs.appendFileSync(path.join(CWD, 'app-error.log'), message);
  }
};
