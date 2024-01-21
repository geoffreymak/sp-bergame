const fs = require('fs');
const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const isDev = require('electron-is-dev');
const pdfOptions = require('../config/pdf');
const reader = require('xlsx');
const path = require('path');
const url = require('url');
const CWD = process.cwd();

// Build paths
const { buildPathHtml, buildPathPdf } = require('../helpers/buildPaths');

async function setBrowser() {
  const executablePath = isDev
    ? chromium.path
    : chromium.path.replace('app.asar', 'app.asar.unpacked');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    timeout: 0
  });

  return browser;
}

const printPdf = async (data) => {
  console.log('Starting: Generating PDF Process, Kindly wait ..');
  /** Launch a headleass browser */
  const browser = await setBrowser();
  console.log('Ending: Browser Process, Kindly wait ..');
  /* 1- Ccreate a newPage() object. It is created in default browser context. */
  const page = await browser.newPage();
  console.log('Ending: Page Process, Kindly wait ..');
  /* 2- Will open our generated `.html` file in the new Page instance. */
  console.log('buildPathHtml', url.pathToFileURL(buildPathHtml).href);
  await page.goto(url.pathToFileURL(buildPathHtml).href, {
    waitUntil: 'networkidle0',
    timeout: 0
  });
  console.log('Ending: Load Page Process, Kindly wait ..');
  /* 3- Take a snapshot of the PDF */

  const pdf = await page.pdf({
    ...pdfOptions(data, !!data.smallTitle),
    printBackground: true,
    timeout: 0
  });
  console.log('Ending: Pdf snapshot Process, Kindly wait ..');
  /* 4- Cleanup: close browser. */
  await browser.close();
  console.log('Ending: Generating PDF Process');
  return pdf;
};

const createPdf = async (data) => {
  try {
    const pdf = await printPdf(data);
    fs.writeFileSync(buildPathPdf, pdf);
    return buildPathPdf;
  } catch (error) {
    console.log('Error generating PDF', error);
    return false;
  }
};

module.exports = createPdf;
