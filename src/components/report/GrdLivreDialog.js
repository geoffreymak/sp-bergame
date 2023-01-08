/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */

import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import Draggable from 'react-draggable';
import Autocomplete, {
  autocompleteClasses,
  createFilterOptions
} from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Popper from '@mui/material/Popper';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import { VariableSizeList } from 'react-window';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { getUniqueCompte } from '../../utils/comptes';

const { ipcRenderer } = window.require('electron');

export const GRAND_LIVRE = 'grand_livre';
export const GRAND_LIVRE_AUXILIAIRE = 'grand_livre_auxiliaire';

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING
  };
  // eslint-disable-next-line no-prototype-builtins
  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Box {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1]}
    </Box>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const ListboxComponent = React.forwardRef((props, ref) => {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true
  });

  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    // eslint-disable-next-line no-prototype-builtins
    if (child.hasOwnProperty('group')) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0
    }
  }
});

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => `${option.compte} ${option.intitule}`
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const BALANCE_GENERALE = 'balance_generale';

function GrdLivreDialog(props) {
  const { open, onClose, type, exercice, handleProgressChange } = props;
  const [date, setDate] = React.useState([null, null]);
  const [devise, setDevise] = React.useState('cdf');
  const [entite, setEntite] = React.useState(null);
  const [compte, setCompte] = React.useState([null, null]);
  const entites = useSelector((state) => state.entites.data);
  const comptes = useSelector((state) => state.comptes.data);

  React.useEffect(() => {
    if (exercice) {
      setDate([
        moment(`01-01-${exercice?.code}`),
        moment(`01-02-${exercice?.code}`)
      ]);
    }
  }, [exercice]);

  const hasValidDate = React.useMemo(() => {
    const year1 = moment(date[0]).year();
    const year2 = moment(date[1]).year();

    return exercice?.code === year1 && exercice?.code === year2;
  }, [date, exercice]);

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {type === BALANCE_GENERALE
          ? ' Impression Balance Général'
          : ' Impression Grand Livre Des Comptes'}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={4} direction="row" justifyContent="space-around">
          <Stack spacing={2}>
            <DesktopDateRangePicker
              startText="Du"
              endText="Au"
              inputFormat="DD/MM/yyyy"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              minDate={moment(`01-01-${exercice?.code}`)}
              maxDate={moment(`12-31-${exercice?.code}`)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} size="small" />
                  <Box sx={{ mx: 2 }} />
                  <TextField {...endProps} size="small" />
                </>
              )}
            />

            <Autocomplete
              id="combo-box-demo"
              options={entites}
              getOptionLabel={(option) => `${option.code} ${option.intitule}`}
              value={entite}
              onChange={(event, newValue) => {
                setEntite(newValue);
              }}
              renderOption={(renderProps, option) => [
                <Stack spacing={2} direction="row" {...renderProps}>
                  <Typography variant="caption" component="div" color="primary">
                    {option.code}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="indigo"
                    noWrap
                  >
                    {option.intitule}
                  </Typography>
                </Stack>
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Communauté"
                  margin="normal"
                  name="entite"
                  variant="outlined"
                  size="small"
                />
              )}
            />

            <Autocomplete
              fullWidth
              autoHighlight
              autoSelect
              id="combo-box-compte"
              value={compte[0]}
              onChange={(event, newValue) => {
                setCompte([newValue, compte[1]]);
              }}
              options={comptes}
              // eslint-disable-next-line arrow-body-style
              getOptionLabel={(option) => {
                return `${option.compte} ${option.intitule}`;
              }}
              renderOption={(renderProps, option) => [
                renderProps,
                <Stack spacing={2} direction="row">
                  <Typography variant="caption" component="div" color="primary">
                    {option.compte}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="indigo"
                    noWrap
                  >
                    {option.intitule}
                  </Typography>
                </Stack>
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Du Compte"
                  name="site"
                  fullWidth
                  size="small"
                />
              )}
              filterOptions={filterOptions}
              disableListWrap
              PopperComponent={StyledPopper}
              ListboxComponent={ListboxComponent}
            />

            <Autocomplete
              fullWidth
              autoHighlight
              autoSelect
              id="combo-box-compte"
              value={compte[1]}
              onChange={(event, newValue) => {
                setCompte([compte[0], newValue]);
              }}
              options={comptes}
              // eslint-disable-next-line arrow-body-style
              getOptionLabel={(option) => {
                return `${option.compte} ${option.intitule}`;
              }}
              renderOption={(renderProps, option) => [
                renderProps,
                <Stack spacing={2} direction="row">
                  <Typography variant="caption" component="div" color="primary">
                    {option.compte}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="indigo"
                    noWrap
                  >
                    {option.intitule}
                  </Typography>
                </Stack>
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Au Compte"
                  name="site"
                  fullWidth
                  size="small"
                />
              )}
              filterOptions={filterOptions}
              disableListWrap
              PopperComponent={StyledPopper}
              ListboxComponent={ListboxComponent}
            />
          </Stack>

          <Stack spacing={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Devise</FormLabel>
              <RadioGroup
                aria-label="gender"
                defaultValue="cdf_cdf"
                name="radio-buttons-group"
                value={devise}
                onChange={(event) => setDevise(event.target.value)}
              >
                <FormControlLabel
                  value="cdf"
                  control={<Radio />}
                  label="Fc (Franc congolais)"
                />
                <FormControlLabel
                  value="usd"
                  control={<Radio />}
                  label="$ (Dollar)"
                />
                <FormControlLabel
                  value="eur"
                  control={<Radio />}
                  label="€ (Euro)"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            // eslint-disable-next-line implicit-arrow-linebreak
            if (!hasValidDate) return;
            const printData = {
              type,
              title:
                type === BALANCE_GENERALE
                  ? 'BALANCE GENERALE'
                  : 'GRAND LIVRE DES COMPTES',

              date: {
                fromDate: moment(date[0]).format(),
                toDate: moment(date[1]).format()
              },
              devise,
              entite,
              compte,
              exercice: exercice?.code,
              smallTitle: true
            };
            handleProgressChange(true);
            await ipcRenderer.invoke('print', printData);
            handleProgressChange(false);
          }}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GrdLivreDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string,
  exercice: PropTypes.object,
  handleProgressChange: PropTypes.func
};

export default GrdLivreDialog;
