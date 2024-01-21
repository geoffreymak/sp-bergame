const fs = require('fs');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');

const createRow = (student) => `
  <tr>
    <td>${student.noStudent}</td>
    <td>${student.username}</td>
    <td>${student.payment[0]}</td>
    <td>${student.payment[1]}</td>
    <td>${student.payment[2]}</td>
  </tr>
`;

const createRowFooter = (data) => `
  <tr>
    <th colspan="2">Total Général</th>
    <th>${data[0]}</th>
    <th>${data[1]}</th>
    <th>${data[2]}</th>
  </tr>  
`;

const createTable = (data) => ` 
  <tr>
    <th colspan="2">${data.classe.classe}</th>
    <th colspan="2">Mouvements</th>
    <th></th>
  </tr>

  <tr>
    <th>Code</th>
    <th>Intitulé</th>
    <th>Débit</th>
    <th>Crédit</th>
    <th>Solde Final</th>
  </tr> 
     
  ${data.students.map(createRow).join('')} 
  
  <tr>
    <th colspan="2">S/Total Classe ${data.classe.classe}</th>
    <th>${data.classe.payment[0]}</th>
    <th>${data.classe.payment[1]}</th>
    <th>${data.classe.payment[2]}</th>
  </tr>  
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

        td{
          font-size: 12px;
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

const generateTable = async (data) => {
  try {
    /* generate table */
    const table = data[0].map(createTable).join('') + createRowFooter(data[1]);
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
