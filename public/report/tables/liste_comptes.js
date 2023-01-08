/* eslint-disable */
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');
const moment = require('moment');
const minifier = require('string-minify');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');
const { groupCompteByCls } = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (data) => {
  return `
    <tr class="no-border">
      <td class="no-border">${data.compte || ''}</td>
      <td class="no-border">${data.intitule || ''}</td>    
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
      <tr class="no-border">
       
        <th style="background-color: white" class="no-border">COMPTE</th>
     
        <th style="background-color: white" class="no-border">INTITULE</th>    
       
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
          display: flex;
          justify-content: center;
          align-items: center;
        }

        tr {
          text-align: left;
          border: 1px solid black;
        }

        th{
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
          max-width: 550px;
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

        .text-right {
          text-align: right;
        }

        .red{
          color: red;
        }

        .blue{
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
