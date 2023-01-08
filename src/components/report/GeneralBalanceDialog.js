/* eslint-disable import/no-cycle */
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
import { BALANCE_GENERALE } from './ReportList';

const { ipcRenderer } = window.require('electron');

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

function GeneralBalanceDialog(props) {
  const { open, onClose, type } = props;
  const [date, setDate] = React.useState([moment(), moment()]);
  const [devise, setDevise] = React.useState('cdf_cdf');
  const [site, setSite] = React.useState(null);
  const [category, setCategory] = React.useState('detailed');
  const sites = useSelector((state) => state.sites.data);
  const [compte, setCompte] = React.useState([null, null]);
  const comptes = useSelector((state) => state.comptes.data);
  const filtredCompte = React.useMemo(() => {
    if (comptes) {
      return getUniqueCompte(comptes, 'ref_compte');
    }
    return comptes;
  }, [comptes]);
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
      scroll="paper"
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {type === BALANCE_GENERALE
          ? 'Impression Balance Generale Des Comptes'
          : 'Impression Balance Generale Des Comptes Par Correspondance'}
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
              maxDate={moment()}
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
              options={sites}
              getOptionLabel={(option) => `${option.libelle}`}
              value={site}
              onChange={(event, newValue) => {
                setSite(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Site"
                  margin="normal"
                  name="site"
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
              options={filtredCompte}
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
              options={filtredCompte}
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
                  value="cdf_cdf"
                  control={<Radio />}
                  label="CDF"
                />
                <FormControlLabel
                  value="usd_cdf"
                  control={<Radio />}
                  label="USD"
                />
                <FormControlLabel
                  value="eur_cdf"
                  control={<Radio />}
                  label="EUR"
                />
                <FormControlLabel
                  value="cfa_cdf"
                  control={<Radio />}
                  label="CFA"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
          {type === BALANCE_GENERALE && (
            <Stack spacing={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup
                  aria-label="gende2r"
                  defaultValue="detailed"
                  name="radio-buttons-group2"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <FormControlLabel
                    value="detailed"
                    control={<Radio />}
                    label="Detaillée"
                  />
                  <FormControlLabel
                    value="agregee"
                    control={<Radio />}
                    label="Agregée"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Annuler
        </Button>
        <Button
          onClick={() => {
            // eslint-disable-next-line implicit-arrow-linebreak
            const printData = {
              type,
              title:
                type === BALANCE_GENERALE
                  ? 'BALANCE GENERALE DES COMPTES'
                  : 'BALANCE GENERALE DES COMPTES PAR CORRESPONDANCE',
              date: {
                fromDate: moment(date[0]).format(),
                toDate: moment(date[1]).format()
              },
              devise,
              category,
              compte,
              site
            };

            ipcRenderer.invoke('print', printData);
          }}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

GeneralBalanceDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string
};

export default GeneralBalanceDialog;
