const fs = require('fs');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');

const createRow = (payment) => `
  <tr>
    <td>${payment.formatedDate}</td>
    <td>${payment.noPaiment}</td>
    <td>${payment.libelle}  ${payment.student.username}</td>
    <td>${payment.credit}</td>
    <td></td>
  </tr>
`;

const createTable = (row, solde, report) => ` 
  <table>
    <tr>
      <th colspan="2"></th>
      <th align="right">Report:</th>
      <th>${report}</th> 
      <th></th>
    </tr> 

    <tr>
      <th>Date</th>
      <th>Piéce</th>
      <th>Libellé</th>
      <th>Débit</th>
      <th>Crédit</th>
    </tr> 
     
    ${row} 

    <tr>
      <th rowspan="3"></th>
      <th rowspan="3"></th>
      <th>TOTAUX</th>
      <th>${solde}</th>
      <th></th>
    </tr>  

    <tr>
      <th>REPORT</th>
      <th>${report}</th>
      <th></th>
    </tr> 

    <tr>
      <th>SOLDE DEBITEUR</th>
      <th></th>
      <th>${report + solde}</th>
    </tr> 

  </table>
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
          background: #FFF
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

        td{
          font-size: 12px;
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
      </style>
    </head>
    <body>
  
      ${table}
     
    </body>
  </html>
`;

const generateTable = async (data) => {
  try {
    const row = data[0].map(createRow).join('');
    /* generate table */
    const table = createTable(row, data[1], data[2]);
    /* generate html */
    const html = createHtml(table);
    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, html);
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
