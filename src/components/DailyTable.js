/*eslint-disable */

import * as React from 'react';
import { Card, TableFooter } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { getWritingsSum } from '../utils/comptes';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    color: theme.palette.info.main
  },
  [`&.${tableCellClasses.footer}`]: {
    fontSize: 14,
    color: theme.palette.primary.light
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  color: theme.palette.info.main,
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const getDevise = (devise) => {
  switch (devise) {
    case 'usd':
      return '$';
    case 'cdf':
      return 'Fc';
    case 'eur':
      return '€';
    case '€':
      return 'eur';
    case '$':
      return 'usd';
    case 'Fc':
      return 'cdf';
    default:
      return '';
  }
};

// eslint-disable-next-line arrow-body-style
const DailyTable = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { writings, onRowDoubleClick } = props;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowDoubleClick = (row) => {
    onRowDoubleClick(row);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - writings?.length) : 0;

  return (
    <Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Parité</StyledTableCell>
              <StyledTableCell align="center">Taux</StyledTableCell>
              <StyledTableCell align="center">Piéce</StyledTableCell>
              <StyledTableCell align="center">Compte</StyledTableCell>
              <StyledTableCell align="center">Libellé</StyledTableCell>
              <StyledTableCell align="center">Montant</StyledTableCell>
              <StyledTableCell align="center">Débit (€)</StyledTableCell>
              <StyledTableCell align="center">Crédit (€)</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {writings
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <StyledTableRow
                  key={idx.toString()}
                  hover
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  style={{
                    minHeight: 30 * 5
                  }}
                >
                  <StyledTableCell component="th" align="center" scope="row">
                    {moment(row.date).format('DD/MM/yyyy')}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numeral(row.parite).format('0,0[.]00') + ' $'}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numeral(row.taux).format('0,0[.]00') + ' Fc'}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.piece}</StyledTableCell>
                  <StyledTableCell align="center">{row.compte}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.libelle}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numeral(
                      row.devise === 'cdf'
                        ? row.montant_cdf
                        : row.devise === 'usd'
                        ? row.montant_usd
                        : row.montant_eur
                    ).format('0,0[.]00') +
                      ' ' +
                      getDevise(row.devise)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.type === 'D'
                      ? numeral(row.montant_total_eur).format('0,0[.]00') + ' €'
                      : ''}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.type === 'C'
                      ? numeral(row.montant_total_eur).format('0,0[.]00') + ' €'
                      : ''}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <StyledTableRow
                style={{
                  height: 30 * emptyRows
                }}
              >
                <StyledTableCell colSpan={6} />
              </StyledTableRow>
            )}
            {writings && !writings.length && (
              <StyledTableRow
                style={{
                  height: 30 * rowsPerPage
                }}
              >
                <StyledTableCell colSpan={10} />
              </StyledTableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell rowSpan={4} colSpan={6} />
              <StyledTableCell rowSpan={4} align="center">
                <Stack spacing={1} justifyContent="end">
                  <Typography
                    variant="overline"
                    component="div"
                    color={'chocolate'}
                  >
                    Totaux (€)
                  </Typography>
                  <Typography variant="overline" component="div">
                    Solde (€)
                  </Typography>
                </Stack>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography color="green" variant="overline" component="div">
                  {/*  {writings &&
                    numeral(getWritingsSum(writings, 'D')).format('0,0[.]00') +
                      ' €'} */}
                  {getWritingsSum(writings, 'D')}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography color="red" variant="overline" component="div">
                  {/*  {writings &&
                    numeral(getWritingsSum(writings, 'C')).format('0,0[.]00') +
                      ' €'} */}
                  {getWritingsSum(writings, 'C')}
                </Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={2} align="center">
                <Typography color="blue" variant="overline" component="div">
                  {writings &&
                    numeral(
                      getWritingsSum(writings, 'D') -
                        getWritingsSum(writings, 'C')
                    ).format('0,0[.]00') + ' €'}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={writings?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Ligne par page"
        // eslint-disable-next-line arrow-body-style
        labelDisplayedRows={({ from, to, count }) => {
          return `${from} - ${to} sur ${
            count !== -1 ? count : `plus de ${to}`
          }`;
        }}
      />
    </Card>
  );
};

DailyTable.propTypes = {
  writings: PropTypes.array
};

export default DailyTable;
