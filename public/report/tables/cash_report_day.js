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
  groupByDayWithReport,
  getCompteSum,
  formatNumber
} = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (data) => {
  return `
    <tr class="no-border">
      <td class="">${data?.piece}</td>
      <td class="">${data?.libelle}</td>
      <td class="text-right">
        ${
          data.type === 'D' && data.montant_cdf
            ? formatNumber(data.montant_cdf)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'C' && data.montant_cdf
            ? formatNumber(data.montant_cdf)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'D' && data.montant_usd
            ? formatNumber(data.montant_usd)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'C' && data.montant_usd
            ? formatNumber(data.montant_usd)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'D' && data.montant_eur
            ? formatNumber(data.montant_eur)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'C' && data.montant_eur
            ? formatNumber(data.montant_eur)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'D' && data.montant_total_eur
            ? formatNumber(data.montant_total_eur)
            : ''
        }
      </td>
      <td class="text-right">
        ${
          data.type === 'C' && data.montant_total_eur
            ? formatNumber(data.montant_total_eur)
            : ''
        }
      </td>
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

/**
 * 
 * @param  {
      soldes: {
        debit1,
        credit1,
        debit2,
        credit2,
        debit3,
        credit3,
        debit4,
        credit4
      },
      report:  {
        debit: 0,
        credit: 0
      },
      date: "",
      parite: 0,
      taux: 0,
      data: []
    }
 * @param {*} compte 
 * @param {*} report 
 * @param {*} idx 
 * @returns 
 */
const createTable2 = (
  { soldes, report, date, parite, taux, data },
  compte,
  generalReport,
  idx
) => {
  const totalReport =
    _.ceil(generalReport.debit - generalReport.credit, 6) +
    _.ceil(report.debit - report.credit, 6);
  return `
    <table>
      <thead>
        <tr class="no-border">
          <td
            style="background-color: white; padding-bottom: 20px;"
            class="no-border text-right"
          >
            Date:
          </td>
          <th
            style="background-color: white; padding-bottom: 20px;"
            class="no-border"
          >
            ${date}
          </th>
          <td
            style="background-color: white; padding-bottom: 20px;"
            class="no-border text-right"
          >
            Taux EUR-CDF:
          </td>
          <th
            style="background-color: white; padding-bottom: 20px;"
            class="no-border"
          >
            ${formatNumber(taux)}
          </th>
          <td
            style="background-color: white; padding-bottom: 20px;"
            class="no-border text-right"
          >
            Parité EUR-USD:
          </td>
          <th
            style="background-color: white; padding-bottom: 20px;"
            class="no-border"
          >
            ${formatNumber(parite)}
          </th>
          <th
            style="background-color: white; padding-bottom: 20px;"
            class="no-border"
          ></th>
          <th
            style="background-color: white; padding-bottom: 20px;"
            class="no-border"
          ></th>
          <th style="background-color: white;" class="no-border text-right">
            Report:
          </th>
          <th style="background-color: white;" class="no-border text-right">
            ${formatNumber(totalReport)}
          </th>
        </tr>
        <tr>
          <th style="background-color: white" class="text-center">Piéce</th>
          <th style="background-color: white" class="text-center">Libéllé</th>
          <th style="background-color: white" class="text-center">
            Entrées CDF
          </th>
          <th style="background-color: white" class="text-center">
            Sorties CDF
          </th>
          <th style="background-color: white" class="text-center">
            Entrées USD
          </th>
          <th style="background-color: white" class="text-center">
            Sorties USD
          </th>
          <th style="background-color: white" class="text-center">
            Entrées EUR
          </th>
          <th style="background-color: white" class="text-center">
            Sorties EUR
          </th>
          <th style="background-color: white" class="text-center">
            T. Entrées EUR
          </th>
          <th style="background-color: white" class="text-center">
            T. Sorties EUR
          </th>
        </tr>
      </thead>
      <tbody>
        ${data.map(createRow).join('')}
        <tr class="">
          <th style="background-color: white" class="text-center"></th>
          <th style="background-color: white" class="text-center">Totaux</th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.debit1)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.credit1)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.debit2)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.credit2)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.debit3)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.credit3)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.debit4)}
          </th>
          <th style="background-color: white" class="text-right">
            ${formatNumber(soldes.credit4)}
          </th>
        </tr>
        <tr class="no-border-b">
          <th
            style="background-color: white"
            class="text-center no-border-t no-border-r no-border-b"
          ></th>
          <th style="background-color: white" class="text-right no-border">
            Solde :
          </th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          >
            ${formatNumber(soldes.debit1 - soldes.credit1)}
          </th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          >
            ${formatNumber(soldes.debit2 - soldes.credit2)}
          </th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          >
            ${formatNumber(soldes.debit3 - soldes.credit3)}
          </th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          >
            ${formatNumber(soldes.debit4 - soldes.credit4)}
          </th>
        </tr>
        <tr class="no-border-t">
          <th
            style="background-color: white"
            class="text-center no-border-t no-border-r no-border-b"
          ></th>
          <th style="background-color: white" class="text-right no-border">
            Solde Final:
          </th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          ></th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          ></th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          ></th>
          <th style="background-color: white" class="text-right no-border"></th>
          <th
            style="background-color: white"
            class="text-right no-border-t no-border-b no-border-l"
          >
            ${formatNumber(totalReport + (soldes.debit4 - soldes.credit4))}
          </th>
        </tr>
      </tbody>
    </table>
  `;
};

const createTable = ({ report, compte, data }) => {
  return groupByDayWithReport(data)
    .map((d, idx) => createTable2(d, compte, report, idx))
    .join('');
};

// eslint-disable-next-line no-unused-vars

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
