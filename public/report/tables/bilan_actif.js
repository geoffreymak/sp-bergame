/* eslint-disable */
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');
const moment = require('moment');
const minifier = require('string-minify');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');
const {
  groupByMouth,
  getCompteSumBilan,
  formatNumber
} = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (data) => {
  const solde1 = _.ceil(data.solde1, 6);
  const solde2 = _.ceil(data.solde2, 6);
  const solde3 = _.ceil(data.solde3, 6);
  const solde4 = _.ceil(data.solde4, 6);

  return `
    <tr class="">
      ${data.sum ? `<th class='text-center'>` : `<td class='text-center'>`}
      ${data.compt1}
      ${data.sum ? `</th>` : `</td>`}

      ${data.sum ? `<th class=''>` : `<td class=''>`}
      ${data.intitule}
      ${data.sum ? `</th>` : `</td>`}
     
      <td class="text-center text-bold"> ${data.note ? data.note : ''}</td>
     
      ${data.sum ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${solde3 ? formatNumber(solde3, true) : ''}
      ${data.sum ? `</th>` : `</td>`}

      ${data.sum ? `<th class='text-right'>` : `<td class='text-right'>`}
     ${solde4 ? formatNumber(solde4, true) : ''}
      ${data.sum ? `</th>` : `</td>`}

      ${data.sum ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${solde1 ? formatNumber(solde1, true) : ''}
      ${data.sum ? `</th>` : `</td>`}

      ${data.sum ? `<th class='text-right'>` : `<td class='text-right'>`}
       ${solde2 ? formatNumber(solde2, true) : ''}
      ${data.sum ? `</th>` : `</td>`}
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = (data) => {
  const { montant1, montant2 } = getCompteSumBilan(data);
  const solde1 = montant1 < montant2 ? montant2 - montant1 : 0;
  const solde2 = montant2 < montant1 ? montant1 - montant2 : 0;

  return `
    <tr>
      <th rowspan="2"></th>
      <th class='no-border'>TOTAL CHARGES</th>
      <th class="text-right no-border-t no-border-b no-border-l">${formatNumber(
        montant1
      )}</th>
      <th rowspan="2"></th>
      <th class='no-border'>TOTAL PRODUITS</th>
      <th class="text-right no-border-t no-border-b no-border-l">${formatNumber(
        montant2
      )}</th>
    </tr>
    <tr class="">
      <th class='red no-border'>${montant1 < montant2 ? 'PERTE' : ''}</th>
      <th class="text-right red no-border-t no-border-b no-border-l">${
        solde1 ? formatNumber(solde1) : ''
      }</th>
      <th class='blue no-border'>${
        montant2 < montant1 ? 'BENEFICE NET' : ''
      }</th>
      <th class="text-right blue no-border-t no-border-b no-border-l">${
        solde2 ? formatNumber(solde2) : ''
      }</th>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createTable = (data) => {
  return `
    <thead>
      <tr class="">
        <th style="background-color: white" rowspan="2" class="text-center">REF</th>
        <th style="background-color: white" rowspan="2" class="text-center">ACTIF</th>
        <th style="background-color: white" rowspan="2">Note</th>
        <th style="background-color: white" colspan="3" class="text-center">EXERCICE N</br>
        <th style="background-color: white" class="text-center">EXERCICE N-1</th>
      </tr>
      <tr  class="">    
        <th style="background-color: white" class="text-center">BRUT</th>
        <th style="background-color: white" class="text-center">Amort & Dépr.</th>
        <th style="background-color: white" class="text-center">NET</th>
        <th style="background-color: white" class="text-center">NET</th>
      </tr>
    </thead>
    <tbody>
     ${data.map(createRow).join('')} 
    </tbody>
  `;
};

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Times New Roman', 'Century Gothic', 'Cambria',
            sans-serif;
        }

        table {
          width: 100%;
        }

        tr {
          text-align: left;
          border: 1px solid black;
        }

        th {
          padding: 5px;
        }

        td {
          padding: 2px 5px;
        }
        tr:nth-child(odd) {
          background: #ccc;
        }
        tr:nth-child(even) {
          background: #fff;
        }
        .no-content {
          background-color: red;
        }
        td,
        th {
          border: 1px solid black;
        }

        table {
          border-collapse: collapse;
          page-break-inside: auto;
          page-break-after: always;
        }

        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        th {
          font-size: 12px;
        }

        td {
          font-size: 11px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          border: none;
        }

        .no-border {
          border: none !important;
        }

        .no-border-l {
          border-left: none !important;
        }

        .no-border-r {
          border-right: none !important;
        }

        .no-border-b {
          border-bottom: none !important;
        }

        .no-border-t {
          border-top: none !important;
        }

        .text-right {
          text-align: right;
        }

        .text-bold {
          font-weight: bold;
        }

        .red {
          color: red;
        }

        .blue {
          color: blue;
        }

        .text-center {
          text-align: center;   
        }
      </style>
    </head>
    <body>
      <table>
        ${table}
      </table>
    </body>
  </html>
`;

/**
 * 
 * @param {Array} data 
 * data exemple 
 * [{
      compt1,
      compt2,
      intitule1,
      intitule2,
      montant1,
      montant2
    }]
  
 */
// eslint-disable-next-line no-unused-vars
const generateTable = async (data) => {
  try {
    /* generate table */
    const table = createTable(data);
    /* generate html */
    const html = createHtml(table);

    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, minifier(html));
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
