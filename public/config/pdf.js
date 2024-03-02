/* eslint-disable indent */
const moment = require('moment');
const { getCurrency } = require('../helpers/comptes');

module.exports = (data, smallTitle = false) => {
  const title =
    data.date && !data.noSubtitle
      ? `
        ${data.title}
        <div class="date-label">
          ${
            data.date.fromDate
              ? `DU ${moment(data.date.fromDate).format('DD/MM/yyyy')}`
              : ''
          }
          ${
            data.date.toDate
              ? `AU ${moment(data.date.toDate).format('DD/MM/yyyy')}`
              : ''
          }
        </div>
      `
      : `${data.title}`;

  return {
    format: 'A4',
    margin: {
      bottom: 30, // minimum required for footer msg to display
      left: 20,
      right: 20,
      top: 120
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Century Gothic', 'Cambria', sans-serif;
            }
            .main {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            .container {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              font-size: 10px;
              font-family: 'Century Gothic', 'Cambria', sans-serif;
            }

            .container2 {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 10px;
              font-family: 'Century Gothic', 'Cambria', sans-serif;
            }

            .left {
              font-size: 11px;
              font-weight: bold;
             
            }

            .left .sub-title {
               font-size: 9px;
              font-weight: normal;
            }

            .center {
              font-weight: bold;
              text-align: center;
              margin-right: 12px;
            }

            .right: {
                font-size: 8px;
            }

            .right-label {
              font-weight: bold;
              font-size: 9px;
            }

            .label {
            }

            .title-label {
             
            }

            .date-label {
              font-size: 9px;
              font-weight: normal;
            }

            .mt {
             margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="main">
            <div class="container">
              <div class="left label">
                Soeurs des Pauvres de Bergame
                <div class="sub-title">Economat Province d'Afrique</div>
                <div class="sub-title mt">${
                  data.entite ? data.entite.intitule : ''
                }</div>
              </div>

              <div class="right">
                <div class="">
                  <span class="right-label">Date:</span>
                  <span class="date"></span>
                </div>
                <div class="">
                  ${
                    data.customDevise
                      ? ` <span class="right-label">Devise:</span>
            <span class="">${data.customDevise}</span>`
                      : ''
                  }
                </div>
                <div class="">
                  <span class="right-label">Page :</span>
                  <span class="pageNumber"></span> sur
                  <span class="totalPages"></span>
                </div>               
              </div>
            </div>
            <div class="container2">
              <div class="center title-label">${title}</div>
            </div>
          </div>
        </body>
      </html>
    `,

    footerTemplate: `
    <span class="pageNumber"></span>/<span class="totalPages"></span>     
    `
  };
};
