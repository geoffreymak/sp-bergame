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
  groupByMouthAndDay,
  getCompteSum,
  formatNumber
} = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (data) => {
  const debit =
    data.type === 'D' ? _.ceil(data.montant, 6) : data.classe ? data.debit : 0;
  const credit =
    data.type === 'C' ? _.ceil(data.montant, 6) : data.classe ? data.credit : 0;

  const credit1 = data.classe
    ? data.debit > data.credit
      ? _.ceil(data.debit - data.credit, 6)
      : 0
    : 0;

  const debit1 = data.classe
    ? data.credit > data.debit
      ? _.ceil(data.credit - data.debit, 6)
      : 0
    : 0;

  return `
    <tr>
      ${data.classe ? `<th class='text-right'>` : `<td class=''>`}
      ${data.date ? moment(data.date).format('DD/MM/yyyy') : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class=''>`}    
      ${data.type === 'D' ? data.compte : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class=''>`}    
      ${data.type === 'C' ? data.compte : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class=''>`}    
      ${data.piece || ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-center'>` : `<td class=''>`}
      ${
        data.classe
          ? data.dayGroup
            ? `S/TOTAL ${data.libelle}`
            : `TOTAL MENSUEL ${data.libelle}`
          : data.libelle
      }
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit ? formatNumber(debit) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit ? formatNumber(credit) : ''}
      ${data.classe ? `</th>` : `</td>`}
    </tr>
    
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = ({ data }) => {
  const { debit, credit } = getCompteSum(data);
  return `
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th>TOTAL JOURNAL</th>
      <th class="text-right">${debit ? formatNumber(debit) : ''}</th>
      <th class="text-right">${credit ? formatNumber(credit) : ''}</th>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createTable = (data) => {
  return `
    <tr>
      <th style="background-color: white" class="">Date</th>
      <th style="background-color: white" class="">Débit</th>
      <th style="background-color: white" class="">Crédit</th>
      <th style="background-color: white" class="">Piéce</th>
      <th style="background-color: white" class="">Libellé</th>
      <th style="background-color: white" class="text-right">Débit</th>
      <th style="background-color: white" class="text-right">Crédit</th>
    </tr>

    ${groupByMouthAndDay(data).map(createRow).join('')}
    ${createRowFooter({ data })}
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
        th,
        td {
          padding: 5px;
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
          font-size: 11px;
        }

        td {
          font-size: 10px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          border: none;
        }

        .text-right {
          text-align: right;
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
    report: reportData {object},
    compte: compteData {object},
    data: data {Array}
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
