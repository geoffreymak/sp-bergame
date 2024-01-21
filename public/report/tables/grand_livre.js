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
      ${data.piece || ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class=''>`}
      ${data.classe ? `Totaux mois de ${data.libelle}` : data.libelle}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit ? formatNumber(debit) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit ? formatNumber(credit) : ''}
      ${data.classe ? `</th>` : `</td>`}
    </tr>
     ${
       data.classe
         ? `<tr>
             <th></th>
             <th></th>
             <th class='text-right'>Solde Mensuel</th>
             <th class='text-right'>${debit1 ? formatNumber(debit1) : ''}</th>
             <th class='text-right'>${credit1 ? formatNumber(credit1) : ''}</th>
           </tr>`
         : ''
     }
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = ({ report, data }) => {
  const { debit, credit } = getCompteSum(data);

  const reportDebit =
    report.debit > report.credit ? _.ceil(report.debit - report.credit, 6) : 0;
  const reportCredit =
    report.credit > report.debit ? _.ceil(report.credit - report.debit, 6) : 0;

  const debit1 = _.ceil(report.debit + debit, 6);
  const credit1 = _.ceil(report.credit + credit, 6);

  const soldeDebit = credit1 > debit1 ? credit1 - debit1 : 0;
  const soldeCredit = debit1 > credit1 ? debit1 - credit1 : 0;

  const label =
    credit > debit
      ? 'SOLDE CREDITEUR'
      : debit > credit
      ? 'SOLDE DEBITEUR'
      : 'SOLDE';

  return `
    <tr>
      <th></th>
      <th></th>
      <th>TOTAUX</th>
      <th class="text-right">${debit ? formatNumber(debit) : ''}</th>
      <th class="text-right">${credit ? formatNumber(credit) : ''}</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>REPORT</th>
      <th class="text-right">${
        reportDebit ? formatNumber(reportDebit) : ''
      }</th>
      <th class="text-right">${
        reportCredit ? formatNumber(reportCredit) : ''
      }</</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>${label}</th>
      <th class="text-right">${soldeDebit ? formatNumber(soldeDebit) : ''}</th>
      <th class="text-right">${
        soldeCredit ? formatNumber(soldeCredit) : ''
      }</th>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createTable = ({ report, compte, data }) => {
  const reportDebit =
    report.debit > report.credit ? _.ceil(report.debit - report.credit, 6) : 0;
  const reportCredit =
    report.credit > report.debit ? _.ceil(report.credit - report.debit, 6) : 0;
  return `
    <table>
      <thead>
        <tr>
          <th style="background-color: white"></th>
          <th style="background-color: white">${compte.compte}</th>
          <th style="background-color: white" class="footer">
            <span> ${compte.intitule} </span> <span> Report : </span>
          </th>
          <th style="background-color: white" class="text-right">
            ${reportDebit ? formatNumber(reportDebit) : ''}
          </th>
          <th style="background-color: white" class="text-right">
            ${reportCredit ? formatNumber(reportCredit) : ''}
          </th>
        </tr>
        <tr>
          <th style="background-color: white" class="">Date</th>
          <th style="background-color: white" class="">Piéce</th>
          <th style="background-color: white" class="">Libellé</th>
          <th style="background-color: white" class="text-right">Débit</th>
          <th style="background-color: white" class="text-right">Crédit</th>
        </tr>
      </thead>
      <tbody>
        ${groupByMouth(data).map(createRow).join('')}
        ${createRowFooter({ report, data })}
      </tbody>
    </table>
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
          background: #FFF;
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
      ${table}
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
    const table = data.map(createTable).join('');
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
