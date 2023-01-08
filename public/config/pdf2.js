/* eslint-disable indent */
const moment = require('moment');
const { getCurrency } = require('../helpers/comptes');

module.exports = (data, smallTitle = false) => {
  const title = data.date
    ? `
    ${data.title}
    <div class="date-label">DU ${moment(data.date.fromDate).format(
      'DD/MM/yyyy'
    )} AU ${moment(data.date.toDate).format('DD/MM/yyyy')}</div>`
    : `${data.title}`;

  return {
    format: 'A4',
    margin: {
      bottom: 40, // minimum required for footer msg to display
      left: 20,
      right: 20,
      top: 100
    },
    displayHeaderFooter: true,
    headerTemplate: `
    <html>
      <head>
        <style>
          body {
            font-family: 'Century Gothic', 'Cambria', sans-serif;
          }
          .container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            font-family: 'Century Gothic', 'Cambria', sans-serif;
          }

          .left {
            font-weight: bold;
            text-align: center;
            flex: ${smallTitle ? '1.5' : '1'};
          }

          .left .sub-title {
            text-decoration: underline;
          }

          .center {
            flex: 2;
            font-weight: bold;
            text-align: center;
            margin-right: 12px;
          }

          .right: {
            flex: 1;   
          }

          .right-label {
            font-weight: bold;
            font-size: inherit;
          }

          .label {
            font-size: ${smallTitle ? '11px' : '12px'};
          }

          .title-label {
            font-size: ${smallTitle ? '12px' : '13px'};
          }

          .date-label {
            font-size: ${smallTitle ? '9px' : '10px'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="left label">
            LA CONGOLAISE DES VOIES MARITIMES
            <div class="sub-title">COMPTABILITE GENERALE</div>
          </div>

          <div class="center title-label">${title}</div>

          <div class="right">
            <div class="">
              <span class="right-label">Date:</span>
              <span class="date"></span>
            </div>
            <div class="">
              <span class="right-label">Devise:</span>
              <span class="">${getCurrency(data.devise)}</span>
            </div>
            <div class="">
              <span class="right-label">Page :</span>
              <span class="pageNumber"></span> sur
              <span class="totalPages"></span>
            </div>
            <div class="">
              <span class="right-label">Site:</span>
              <span class="">RVM</span>
            </div>
          </div>
        </div>
      </body>
    </html>`,

    footerTemplate: `
    <span class="pageNumber"></span>/<span class="totalPages"></span>     
    `
  };
};
