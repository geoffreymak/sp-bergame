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
const createRow = (data, compte, idx) => {
  const debit = data.type === 'D' ? _.ceil(data.montant, 6) : 0;
  const credit = data.type === 'C' ? _.ceil(data.montant, 6) : 0;
  const solde = _.ceil(debit - credit, 6);

  return `
    <tr class="no-border">
      <td class="no-border-t no-border-b">${
        idx === 0 ? compte.ref_compte : ''
      }</td>
      <td class="no-border-t no-border-b">${idx === 0 ? compte.compte : ''}</td>
      <td class="no-border-t no-border-b">${moment(data.date).format(
        'DD/MM/yyyy'
      )}</td>
      <td class="no-border-t no-border-b">${data.piece}</td>
      <td class="no-border-t no-border-b">${data.libelle}</td>
      <td class="text-right no-border-t no-border-b">${
        debit ? formatNumber(debit) : ''
      }</td>
      <td class="text-right no-border-t no-border-b">${
        credit ? formatNumber(credit) : ''
      }</td>
      <td class="text-right no-border-t no-border-b">${formatNumber(solde)}</td>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = ({ report, data }) => {
  const { debit, credit } = getCompteSum(data);
  const solde = _.ceil(debit - credit, 6);

  return `
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th>TOTAUX</th>
      <th class="text-right">${formatNumber(debit)}</th>
      <th class="text-right">${formatNumber(credit)}</th>
      <th class="text-right">${formatNumber(solde)}</th>
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
      <tr>
        <th rowspan="2" style="background-color: white" class="no-border-r">
          Compte
        </th>
        <th
          rowspan="2"
          style="background-color: white"
          class="no-border-l no-border-r"
        >
          Code
        </th>
        <th
          rowspan="2"
          style="background-color: white"
          class="no-border-l no-border-r"
        >
          Date
        </th>
        <th rowspan="2" style="background-color: white" class="no-border-l">
          Piéce
        </th>
        <th style="background-color: white" class="d-flex">
          <span class="f-1"></span>
          <span class="text-center f-1">REPORT</span>
        </th>
        <th colspan="2" style="background-color: white"  class="text-center">MOUVEMENTS</th>
        <th style="background-color: white" class="text-center">SOLDE</th>
      </tr>
      <tr>
        <th style="background-color: white" class="d-flex">
          <span class="f-1">Libellé</span>
          <span class="f-1 d-flex space-around">
            <span>Débit</span>
            <span>Crédit</span>
          </span>
        </th>
        <th style="background-color: white" class="text-center">Débit</th>
        <th style="background-color: white" class="text-center">Crédit</th>
        <th style="background-color: white"></th>
      </tr>
      <tr>
        <th colspan="4" style="background-color: white" class="">
          ${compte.intitule}
        </th>
        <th style="background-color: white" class="d-flex">
          <span class="f-1"></span>
          <span class="f-1 d-flex space-between">
            <span>${reportDebit ? formatNumber(reportDebit) : ''}</span>
            <span>${reportCredit ? formatNumber(reportCredit) : ''}</span>
          </span>
        </th>
        <th style="background-color: white" class=""></th>
        <th style="background-color: white" class=""></th>
        <th style="background-color: white" class=""></th>
      </tr>

      ${data.map((d, idx) => createRow(d, compte, idx)).join('')}
      ${createRowFooter({ report, data })}
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

        .no-border{
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

        .d-flex {
         display: flex;
        border: none;
        }

        .space-between {
          justify-content: space-between;
        }

        .space-around {
          justify-content: space-around;
        }

        .f-1 {
         flex: 1;
        }

        @media print {
          @page {
            size: landscape;
          }
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
