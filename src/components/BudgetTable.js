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
// import Container from '@mui/material/Container';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { useDispatch, useSelector } from 'react-redux';

import { getWritingsSum } from '../utils/comptes';

import { addBudget, updateBudget } from '../redux/budget/budgetSlice';

const { ipcRenderer } = window.require('electron');
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

const columns = [
  { field: 'compte', headerName: 'Compte', flex: 1 },
  {
    field: 'intitule',
    headerName: 'Intitulé',
    type: 'string',
    flex: 4
  },
  {
    field: 'prevision',
    headerName: 'Prévision Annuelle',
    flex: 3,
    editable: true,
    type: 'number',
    valueFormatter: (params) => {
      return numeral(params.value).format('0,0[.]00 $');
    }
  }
];

// eslint-disable-next-line arrow-body-style
const BudgetTable = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { comptes, entite, exercice } = props;
  const dispatch = useDispatch();
  // const exercices = useSelector((state) => state.exercices.data);

  const [editRowsModel, setEditRowsModel] = React.useState({});

  const handleEditRowsModelChange = React.useCallback((model, details) => {
    setEditRowsModel(model);
    console.log('editRowsModel', model);
    console.log('details', details);
  }, []);

  const handleCellEditCommit = React.useCallback(
    async (params) => {
      try {
        const compte = comptes.find((c) => c.compte === params.id);
        if (compte) {
          const data = {
            compte: compte?.compte,
            intitule: compte?.intitule,
            type: compte?.type,
            entite: entite?.code,
            exercice: exercice?.code,
            prevision: params.value
          };

          const event = compte.prevision ? 'update-budget' : 'set-budget';
          const response = await ipcRenderer.invoke(event, data);
          if (!response.error) {
            if (compte.prevision) {
              dispatch(updateBudget(data));
            } else {
              dispatch(addBudget(JSON.parse(response.data)));
            }
            console.log('commited: ' + event, JSON.parse(response.data));
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    [comptes, entite]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const changedCompte = React.useMemo(() => {
    return comptes.filter((c) => c.prevision);
  }, [comptes]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comptes?.length) : 0;

  return (
    <Card>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={comptes}
          columns={columns}
          onCellEditCommit={handleCellEditCommit}
          rowHeight={40}
        />
      </div>
    </Card>
  );
};

BudgetTable.propTypes = {
  comptes: PropTypes.array,
  entite: PropTypes.object
};

export default BudgetTable;
