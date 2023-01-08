import * as React from 'react';
import { Card } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(date, piece, imputation, libelle, devise, debit, credit) {
  // eslint-disable-next-line object-curly-newline
  return { date, piece, imputation, libelle, devise, debit, credit };
}

const rows = [
  createData(
    '27/09/2021',
    'RCC-FRT-ERT',
    100542,
    'Achat fourniture',
    '$',
    600,
    0
  ),
  createData(
    '27/09/2021',
    'RCC-FRT-ERT',
    100542,
    'Achat fourniture',
    '$',
    600,
    0
  ),
  createData(
    '27/09/2021',
    'RCC-FRT-ERT',
    100542,
    'Achat fourniture',
    '$',
    600,
    0
  ),
  createData(
    '27/09/2021',
    'RCC-FRT-ERT',
    100542,
    'Achat fourniture',
    '$',
    600,
    0
  ),
  createData(
    '27/09/2021',
    'RCC-FRT-ERT',
    100542,
    'Achat fourniture',
    '$',
    600,
    0
  )
];

// eslint-disable-next-line arrow-body-style
const AccountDailyTable = () => {
  return (
    <Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Piéce</TableCell>
              <TableCell align="right">Imputations</TableCell>
              <TableCell align="right">Libellé</TableCell>
              <TableCell align="right">Devise</TableCell>
              <TableCell align="right">Débit</TableCell>
              <TableCell align="right">Crédit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx.toString()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.piece}</TableCell>
                <TableCell align="right">{row.imputation}</TableCell>
                <TableCell align="right">{row.libelle}</TableCell>
                <TableCell align="right">{row.devise}</TableCell>
                <TableCell align="right">{row.debit}</TableCell>
                <TableCell align="right">{row.credit}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={2} colSpan={4} />
              <TableCell rowSpan={2} align="right">
                Totaux
              </TableCell>
              <TableCell align="right">600</TableCell>
              <TableCell align="right">600</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} align="right">
                0
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default AccountDailyTable;
