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
  const debit1 = _.ceil(data.debit1, 6);
  const credit1 = _.ceil(data.credit1, 6);
  const debit2 = _.ceil(data.debit, 6);
  const credit2 = _.ceil(data.credit, 6);
  const debit3 = _.ceil(debit1 + debit2, 6);
  const credit3 = _.ceil(credit1 + credit2, 6);
  const solde = _.ceil(debit3 - credit3, 6);

  return `
    <tr>
      <td>${data.compt1}</td>
      ${
        data.classe
          ? `<th class='footer'><span>${
              data.classe?.length === 1 ? 'Total Classe' : 'S/Total Classe'
            }</span><span>${data.classe}</span></th>`
          : `<td class=''>${data.intitule}</td>`
      }

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit1 ? formatNumber(debit1) : ''} 
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit1 ? formatNumber(credit1) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit2 ? formatNumber(debit2) : ''}
       ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit2 ? formatNumber(credit2) : ''} 
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${debit3 ? formatNumber(debit3) : ''} 
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${credit3 ? formatNumber(credit3) : ''}
      ${data.classe ? `</th>` : `</td>`}

      ${data.classe ? `<th class='text-right'>` : `<td class='text-right'>`}
      ${formatNumber(solde)} 
      ${data.classe ? `</th>` : `</td>`}
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
const createRowFooter = (data) => `
  <tr>
    <th></th>
    <th>Total Général</th>
    <th class='text-right'>${numeral(data.debit1).format('0,0.00')}</th>
    <th class='text-right'>${numeral(data.credit1).format('0,0.00')}</th>
    <th class='text-right'>${numeral(data.debit).format('0,0.00')}</th>
    <th class='text-right'>${numeral(data.credit).format('0,0.00')}</th>
    <th class='text-right'>${numeral(data.debit1 + data.debit).format(
      '0,0.00'
    )}</th>
    <th class='text-right'>${numeral(data.credit1 + data.credit).format(
      '0,0.00'
    )}</th>
    <th class='text-right'>${numeral(
      data.debit1 + data.debit - (data.credit1 + data.credit)
    ).format('0,0.00')}</th>
  </tr>  
`;

// eslint-disable-next-line no-unused-vars
const createTable = (data) => `
  <thead>
    <tr>
      <th rowspan="2" style="background-color: white">Compte</th>
      <th td="" rowspan="2" style="background-color: white">Intitulé</th>
      <th colspan="2" style="background-color: white" class="text-center">
        REPORT A NOUVEAU
      </th>
      <th colspan="2" style="background-color: white" class="text-center">
        MOUVEMENTS
      </th>
      <th colspan="2" style="background-color: white" class="text-center">
        CUMULUS
      </th>
      <th style="background-color: white"></th>
    </tr>
    <tr>
      <th style="background-color: white" class="text-center">Débit</th>
      <th style="background-color: white" class="text-center">Crédit</th>
      <th style="background-color: white" class="text-center">Débit</th>
      <th style="background-color: white" class="text-center">Crédit</th>
      <th style="background-color: white" class="text-center">Débit</th>
      <th style="background-color: white" class="text-center">Crédit</th>
      <th style="background-color: white" class="text-right">Solde Final</th>
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
        
        @media print {
          @page {
            size: landscape;
          }
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
