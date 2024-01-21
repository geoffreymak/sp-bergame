/* eslint-disable */
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');
const minifier = require('string-minify');
// JSON data

_.sumBy();
// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');
const {
  groupBalance,
  totalSum,
  formatNumber
} = require('../../helpers/comptes');

// eslint-disable-next-line no-unused-vars
const createRow = (
  {
    compte,
    parite,
    previsionUSD,
    previsionEUR,
    moyenne,
    montant,
    percent,
    data
  },
  month
) => {
  return `
    <tr>
      <td>
        <div style="display: flex;">
          <div>${compte.compte}</div>
          <div style="width: 10px; height: 1px;"></div>
          <div>${compte.intitule}</div>
        </div>
      </td>
      <td class="text-right">${formatNumber(previsionUSD)}</td>
      <td class="text-right">${formatNumber(previsionEUR)}</td>
      <td class="text-right">${formatNumber(moyenne)}</td>
      <td class="text-right">${formatNumber(data[month]?.montant)}</td>
      <td class="text-right">${formatNumber(data[month]?.percent)}</td>
    </tr>
  `;
};

const createRowFooter = (data, type, month) => {
  const previsionUSD = _.sumBy(data, (d) => d.previsionUSD);
  const previsionEUR = _.sumBy(data, (d) => d.previsionEUR);
  const moyenne = _.sumBy(data, (d) => d.moyenne);
  const montant = _.sumBy(data, (d) => d.data[month]?.montant);
  const percent = _.ceil((montant * 100) / moyenne, 6);

  return `
    <tr>
      <th>Total ${type}</th>
      <th class="text-right">${formatNumber(previsionUSD)}</th>
      <th class="text-right">${formatNumber(previsionEUR)}</th>
      <th class="text-right">${formatNumber(moyenne)}</th>
      <th class="text-right">${formatNumber(montant)}</th>
      <th class="text-right">${formatNumber(percent)}</th>
    </tr>
  `;
};

// eslint-disable-next-line no-unused-vars
// const createRowFooter = (data) => {
//   const debit = _.ceil(data.debit, 6);
//   const credit = _.ceil(data.credit, 6);
//   const soldeDebit = _.ceil(debit - credit, 6);
//   const soldeCredit = _.ceil(credit - debit, 6);

//   return `
//     <tr>
//       <th>${data[0]}</th>
//       <th>Total Général</th>
//       <th class="text-right">${formatNumber(data.debit)}</th>
//       <th class="text-right">${formatNumber(data.credit)}</th>
//       <th class="text-right">
//         ${debit > credit ? formatNumber(soldeDebit) : ''}
//       </th>
//       <th class="text-right">
//         ${credit > debit ? formatNumber(soldeCredit) : ''}
//       </th>
//     </tr>
//   `;
// };

// eslint-disable-next-line no-unused-vars
const createTable = (data, type, month) => `
  <table>
    <thead>
      <tr>
        <th style="background-color: white" class="text-center">Les ${type}</th>
        <th style="background-color: white" class="text-center">
          Prevision Annuelle ($)
        </th>
        <th style="background-color: white" class="text-center">
          Prevision Annuelle (€)
        </th>
        <th style="background-color: white" class="text-center">
          Moyenne Mensuel
        </th>
        <th style="background-color: white" class="text-center">
          Montant Realisé
        </th>
        <th style="background-color: white" class="text-center">% Realisé</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((d) => createRow(d, month)).join('')} 
      ${createRowFooter(data, type, month)}
    </tbody>
  </table>
`;
// ${createRowFooter(totalSum(data))}
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
          font-weight: bold;
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

// eslint-disable-next-line no-unused-vars
const generateTable = async ({ month, data }) => {
  try {
    /* generate table */
    // const table = data[0].map(createTable).join('') + createRowFooter(data[1]);
    /* generate html */
    // const html = createHtml(table);
    const charges = data
      .filter((d) => d.compte?.type === 'D')
      .sort((a, b) => a.compte?.compte?.localeCompare(b.compte?.compte));
    const produits = data
      .filter((d) => d.compte?.type === 'C')
      .sort((a, b) => a.compte?.compte?.localeCompare(b.compte?.compte));

    const html = createHtml(
      createTable(charges, 'Charges', month) +
        createTable(produits, 'Produits', month)
    );

    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, minifier(html));
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
