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
const createRow = ({
  compte,
  parite,
  previsionUSD,
  previsionEUR,
  moyenne,
  montant,
  percent,
  data
}) => {
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
      <td class="text-right">${formatNumber(data[0].montant)}</td>
      <td class="text-right">${formatNumber(data[1].montant)}</td>
      <td class="text-right">${formatNumber(data[2].montant)}</td>
      <td class="text-right">${formatNumber(data[3].montant)}</td>
      <td class="text-right">${formatNumber(data[4].montant)}</td>
      <td class="text-right">${formatNumber(data[5].montant)}</td>
      <td class="text-right">${formatNumber(data[6].montant)}</td>
      <td class="text-right">${formatNumber(data[7].montant)}</td>
      <td class="text-right">${formatNumber(data[8].montant)}</td>
      <td class="text-right">${formatNumber(data[9].montant)}</td>
      <td class="text-right">${formatNumber(data[10].montant)}</td>
      <td class="text-right">${formatNumber(data[11].montant)}</td>
      <td class="text-right">${formatNumber(montant)}</td>
      <td class="text-right">${formatNumber(percent)}</td>
    </tr>
  `;
};

const createRowFooter = (data, type) => {
  const previsionUSD = _.sumBy(data, (d) => d.previsionUSD);
  const previsionEUR = _.sumBy(data, (d) => d.previsionEUR);
  const moyenne = _.sumBy(data, (d) => d.moyenne);
  const montant = _.sumBy(data, (d) => d.montant);
  const percent = _.ceil((montant * 100) / previsionEUR, 6);

  const m1 = _.sumBy(data, (d) => d.data[0]?.montant);
  const m2 = _.sumBy(data, (d) => d.data[1]?.montant);
  const m3 = _.sumBy(data, (d) => d.data[2]?.montant);
  const m4 = _.sumBy(data, (d) => d.data[3]?.montant);
  const m5 = _.sumBy(data, (d) => d.data[4]?.montant);
  const m6 = _.sumBy(data, (d) => d.data[5]?.montant);
  const m7 = _.sumBy(data, (d) => d.data[6]?.montant);
  const m8 = _.sumBy(data, (d) => d.data[7]?.montant);
  const m9 = _.sumBy(data, (d) => d.data[8]?.montant);
  const m10 = _.sumBy(data, (d) => d.data[9]?.montant);
  const m11 = _.sumBy(data, (d) => d.data[10]?.montant);
  const m12 = _.sumBy(data, (d) => d.data[11]?.montant);

  return `
    <tr>
      <th>Total ${type}</th>
      <th class="text-right">${formatNumber(previsionUSD)}</th>
      <th class="text-right">${formatNumber(previsionEUR)}</th>
      <th class="text-right">${formatNumber(moyenne)}</th>
      <th class="text-right">${formatNumber(m1)}</th>
      <th class="text-right">${formatNumber(m2)}</th>
      <th class="text-right">${formatNumber(m3)}</th>
      <th class="text-right">${formatNumber(m4)}</th>
      <th class="text-right">${formatNumber(m5)}</th>
      <th class="text-right">${formatNumber(m6)}</th>
      <th class="text-right">${formatNumber(m7)}</th>
      <th class="text-right">${formatNumber(m8)}</th>
      <th class="text-right">${formatNumber(m9)}</th>
      <th class="text-right">${formatNumber(m10)}</th>
      <th class="text-right">${formatNumber(m11)}</th>
      <th class="text-right">${formatNumber(m12)}</th>
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
const createTable = (data, type) => `
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
        <th style="background-color: white" class="text-center">Janvier</th>
        <th style="background-color: white" class="text-center">Fevrier</th>
        <th style="background-color: white" class="text-center">Mars</th>
        <th style="background-color: white" class="text-center">Avril</th>
        <th style="background-color: white" class="text-center">Mai</th>
        <th style="background-color: white" class="text-center">Juin</th>
        <th style="background-color: white" class="text-center">Juillet</th>
        <th style="background-color: white" class="text-center">Août</th>
        <th style="background-color: white" class="text-center">Septembre</th>
        <th style="background-color: white" class="text-center">Octobre</th>
        <th style="background-color: white" class="text-center">Novembre</th>
        <th style="background-color: white" class="text-center">Décembre</th>
        <th style="background-color: white" class="text-center">
          Total Annuelle
        </th>
        <th style="background-color: white" class="text-center">% Realisé</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(createRow).join('')}
      ${createRowFooter(data, type)}
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

// eslint-disable-next-line no-unused-vars
const generateTable = async ({ data }) => {
  try {
    /* generate table */
    // const table = data[0].map(createTable).join('') + createRowFooter(data[1]);
    /* generate html */
    // const html = createHtml(table);
    const charges = data
      .filter((d) => d.compte?.type !== 'C')
      .sort((a, b) => a.compte?.compte?.localeCompare(b.compte?.compte));
    const produits = data
      .filter((d) => d.compte?.type === 'C')
      .sort((a, b) => a.compte?.compte?.localeCompare(b.compte?.compte));

    const html = createHtml(
      createTable(charges, 'Charges') + createTable(produits, 'Produits')
    );

    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, minifier(html));
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
