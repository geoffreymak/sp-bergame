const fs = require('fs');
// JSON data

// Build paths
const { buildPathHtml } = require('../../helpers/buildPaths');

const createRow = (student) => `
  <tr>
    <td>${student.noStudent}</td>
    <td>${student.username}</td>
    <td>${student.sexe}</td>
    <td>${student.phone}</td>
  </tr>
`;

const createTable = (data) => ` 
  <table>
    <tr>
      <th>${data.classe.codeClasse}</th>
      <th colspan="3">${data.classe.classe}</th>   
    </tr> 

    <tr>
      <th>Code</th>
      <th>Nom Post-Nom & Prenon</th>
      <th>Sexe</th>
      <th>Telephone</th>
    </tr> 
 
    ${data.students.map(createRow).join('')} 

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

        td{
          font-size: 12px;
        }

        table { 
          page-break-inside:auto;
          page-break-after: always;
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
    /* generate table */
    const table = data.map(createTable).join('');
    /* generate html */
    const html = createHtml(table);
    console.log(html);
    /* write the generated html to file */
    fs.writeFileSync(buildPathHtml, html);
    console.log('Succesfully created an HTML table');
  } catch (error) {
    console.log('Error generating table', error);
  }
};

module.exports = generateTable;
