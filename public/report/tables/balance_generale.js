/* eslint-disable */
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');
const minifier = require('string-minify');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');
const {
  groupBalance,
  totalSum,
  formatNumber
} = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (data) => {
  const debit = _.ceil(data.debit, 6);
  const credit = _.ceil(data.credit, 6);
  const soldeDebit = _.ceil(debit - credit, 6);
  const soldeCredit = _.ceil(credit - debit, 6);

  return `
    <tr>
      <td>${data.compt1}</td>
      <td class=''>${data.intitule}</td>

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit ? formatNumber(debit) : ''} 
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit ? formatNumber(credit) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit > credit ? formatNumber(soldeDebit) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit > debit ? formatNumber(soldeCredit) : ''}
      ${data.classe ? `</th>` : `</td>`} 
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = (data) => {
  const debit = _.ceil(data.debit, 6);
  const credit = _.ceil(data.credit, 6);
  const soldeDebit = _.ceil(debit - credit, 6);
  const soldeCredit = _.ceil(credit - debit, 6);

  return `
    <tr>
      <th></th>
      <th>Total Général</th>
      <th class="text-right">${formatNumber(data.debit)}</th>
      <th class="text-right">${formatNumber(data.credit)}</th>
      <th class="text-right">
        ${debit > credit ? formatNumber(soldeDebit) : ''}
      </th>
      <th class="text-right">
        ${credit > debit ? formatNumber(soldeCredit) : ''}
      </th>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createTable = (data) => `
  <thead>
    <tr>
      <th rowspan="2" style="background-color: white">Compte</th>
      <th td="" rowspan="2" style="background-color: white">Intitulé</th>     
      <th colspan="2" style="background-color: white" class="text-center">
        MOUVEMENTS
      </th>
      <th colspan="2" style="background-color: white" class="text-center">
        SOLDE
      </th>
    </tr>
    <tr>
      <th style="background-color: white" class="text-center">Débit</th>
      <th style="background-color: white" class="text-center">Crédit</th>
      <th style="background-color: white" class="text-center">Débit</th>
      <th style="background-color: white" class="text-center">Crédit</th>
    </tr>
  </thead>
  <tbody>
    ${data.map(createRow).join('')}
    ${createRowFooter(totalSum(data))}
  </tbody>
`;

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table) => `
  <html>
    <head>
      <style>
        body{
          font-family: "Times New Roman", "Century Gothic", "Cambria", sans-serif;
        }
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 5px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
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
        }

        table { 
          page-break-inside:auto;
        }
        tr { 
          page-break-inside:avoid; 
          page-break-after:auto;
        }

         th{
          font-size: 11px;
        }

        td{
          font-size: 10px;
        }

        .footer{
          display: flex;
          justify-content: space-between;         
          font-weight: bold;
          border: none;
        }

        .text-right{
          text-align: right;
        }

        .text-center{
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

// eslint-disable-next-line no-unused-vars
const generateTable = async (data) => {
  try {
    /* generate table */
    // const table = data[0].map(createTable).join('') + createRowFooter(data[1]);
    /* generate html */
    // const html = createHtml(table);
    const html = createHtml(createTable(data));

    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, minifier(html));
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
