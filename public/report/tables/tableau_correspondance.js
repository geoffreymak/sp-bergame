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
/**
 * 
 * @param {*} data 
 *   {
      note: '',
      intitule: '',
      data: [
        {
          note: '',
          intitule: '',
          compte: '',
          data: [{ debit: 0, credit: 0, intitule: '', compte: '', compt2: '' }]
        }
      ]
    }
 */
const createRow = (data) => {
  return `
    <tr>
      <th colspan="4">NOTE ${data.note} ${data.intitule}</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
    ${data.data.map(createSecondRow).join('')}
  `;
};

/**
 * 
 * @param {*} data 
 *   {
          note: '',
          intitule: '',
          compte: '',
          data: [{ debit: 0, credit: 0, solde 0, intitule: '', compte: '', compt2: '' }]
        }
 */
const createSecondRow = (data, idx) => {
  const currData = data.data[0];
  const currData2 = data.data.slice(1);
  const solde = data.data.reduce((prev, curr) => {
    return parseFloat(prev + curr.solde);
  }, 0);
  return `
    <tr>
      <th class='text-center'></th>
      <th></th>
      <th class='text-center'>${data.compte}</th>
      <th>${data.intitule}</th>
      <th class='text-right'>${formatNumber(solde)}</th>
      <td class='text-center'>1</td>
      <td class='text-center'>${currData.compte}</td>
      <td>${currData.intitule}</td>
      <td class='text-right'>${formatNumber(currData.solde)}</td>
    </tr>
    ${currData2.map(createSecondRow2).join('')}
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th colspan="2" class='text-center'>Total ${data.intitule}</th>
      <th class='text-right'>${formatNumber(solde)}</th>
    </tr>
  `;
};

const createSecondRow2 = (data, idx) => {
  // const solde = _.ceil(data.debit - data.credit, 6);
  return `
    <tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <td class='text-center'>${idx + 2}</td>
      <td class='text-center'>${data.compte}</td>
      <td>${data.intitule}</td>
      <td class='text-right'>${formatNumber(data.solde)}</td> 
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
/**
 * 
 * @param {*} data 
 *  [
    {
      note: '',
      intitule: '',
      data: [
        {
          note: '',
          intitule: '',
          compte: '',
          data: [{ debit: 0, credit: 0, intitule: '', compte: '', compt2: '' }]
        }
      ]
    }
  ];
 */
const createTable = (data) => `
  <thead>
    <tr>
      <th style="background-color: white">N°</th>
      <th style="background-color: white">CODE CORRESP.</th>
      <th style="background-color: white" class="text-center">
        COMPTE
      </th>
      <th style="background-color: white" class="text-center">
        POSTE / INTITULE
      </th>
      <th style="background-color: white" class="text-center">
        Montant total classe Svt Balance fin N
      </th>
      <th style="background-color: white">N°</th>
      <th style="background-color: white">COMPTE A REGROUP.</th>
      <th style="background-color: white">INTITULES</th>
      <th style="background-color: white">SOLDES</th>
    </tr>
    <tr>
      <th colspan="9" style="background-color: white" class="text-center"></th>
    </tr>
  </thead>
  <tbody>
   ${data.map(createRow).join('')}
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
/**
 * 
 * @param {*} data 
 *  [
    {
      note: '',
      intitule: '',
      data: [
        {
          note: '',
          intitule: '',
          compte: '',
          data: [{ debit: 0, credit: 0, intitule: '', compte: '', compt2: '' }]
        }
      ]
    }
  ];
 */
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
