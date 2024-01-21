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
const createRow = ({ isTitle, isTotal, libelle, empty, code, solde, color }) => {
  const bg = color ? "bg-red": "bg-yellow"
  return empty
    ? `<tr>
        <td><pre> </pre></td>
        <td><pre> </pre></td>
      </tr>`
    : `
        <tr>
          ${
            isTitle || isTotal
              ? `<td colspan="${isTitle ? '2' : '0'}" class="text-weight ${
                  isTotal ? `text-right ${bg}` : ''
                } ${isTitle ? 'p bg-green' : ''}">${libelle}</td>`
              : `<td class="">${libelle}</td>`
          }
          ${
            isTitle
              ? ''
              : `<td class="text-right ${
                  isTotal ? `text-right text-weight ${bg}` : ''
                }">${solde ? formatNumber(solde) : '-'}</td>`
          }
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
const createTable = (data) => `
  <table>
    <tbody>
      ${data.map(createRow).join('')}

      <tr class="no-border">
        <td class="no-border"><pre></pre></td>
        <td class="no-border"><pre></pre></td>
      </tr>

      <tr class="no-border">
        <td class="no-border"><pre></pre></td>
        <td class="no-border"><pre></pre></td>
      </tr>

      <tr class="no-border">
        <td class="no-border">Signature de la supérieure</td>
        <td class="no-border"></td>
      </tr>

      <tr class="no-border">
        <td class="no-border"><pre></pre></td>
        <td class="no-border"><pre></pre></td>
      </tr>

      <tr class="no-border">
        <td class="no-border">Signature de l’économe de communauté</td>
        <td class="no-border"></td>
      </tr>

      <tr class="no-border">
        <td class="no-border"><pre></pre></td>
        <td class="no-border"><pre></pre></td>
      </tr>

      <tr class="no-border">
        <td class="no-border"><pre></pre></td>
        <td class="no-border"><pre></pre></td>
      </tr>
      <tr class="no-border">
        <td class="no-border"></td>
        <td class="no-border text-right">Date................</td>
      </tr>
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
          font-family: 'Century Gothic', 'Times New Roman', 'Century Gothic', 'Cambria',
            sans-serif;
        }
       
        table {
          width: 70%;
          margin: 0 auto;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th,
        td {
          padding: 2px 6px;
        }
        .p{
          padding: 6px;
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
          font-size: 13px;
        }

        .no-border{
          border: none;
        }

        .text-weight {
          font-size: 14px;
          font-weight: bold;
        }

       .bg-green{
        background: #739214;
       }

        .bg-yellow{
        background: #FFCA28;
       }

       .bg-red{
        background: tomato;
       }

       .red{
        color: tomato;
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
const generateTable = async (data) => {
  try {
    const html = createHtml(createTable(data));

    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, minifier(html));
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
