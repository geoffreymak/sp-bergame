/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
import React, { useState, useMemo, useCallback, useRef } from 'react';
// eslint-disable-next-line object-curly-newline
import { Box, Card, CardContent, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  autocompleteClasses,
  createFilterOptions
} from '@mui/material/Autocomplete';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import ListSubheader from '@mui/material/ListSubheader';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import NumberFormat from 'react-number-format';
import Popper from '@mui/material/Popper';
import { useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import { IMaskInput } from 'react-imask';
import moment from 'moment';
// eslint-disable-next-line import/named
import { getComptesStartsWith, getWritingsSum } from '../utils/comptes';

const { dialog } = window.require('@electron/remote');
// const { ipcRenderer } = window.require('electron');

const DEFAULT_DEVISE = 'cdf_cdf';

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

// Adapter for react-window
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

const TextMaskCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000-000-#+/a"
      definitions={{
        '#': /[0-1]/,
        '+': /[0-2]/
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const NumberFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
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

const DailyToolbar = (props) => {
  const [date, setDate] = useState(moment());
  const [dateIsValid, setDateIsValid] = useState(true);
  const [compte, setCompte] = useState(null);
  const [imputation, setImputation] = useState(null);
  const [devise, setDevise] = useState(DEFAULT_DEVISE);
  const [piece, setPiece] = useState('');
  const [libelle, setLibelle] = useState('');
  const [debit, setDebit] = useState(null);
  const [credit, setCredit] = useState(null);

  const compteRef = useRef(null);
  const dateRef = useRef(null);
  const imputationRef = useRef(null);
  const deviseRef = useRef(null);
  const pieceRef = useRef(null);
  const libelleRef = useRef(null);
  const debitRef = useRef('');
  const creditRef = useRef('');

  const comptes = useSelector((state) => state.comptes.data);
  const journals = useSelector((state) => state.journals.data);

  // eslint-disable-next-line object-curly-newline
  const {
    title,
    category,
    filters,
    needJournal,
    writings,
    addWriting,
    cleardWriting,
    saveWriting
  } = props;

  // eslint-disable-next-line arrow-body-style
  const filtredComptes = useMemo(() => {
    const data = needJournal ? journals : comptes;
    if (!!data && !!filters && !!filters.length) {
      let results = [];
      filters.forEach((filter) => {
        results = [...results, ...getComptesStartsWith(data, filter)];
      });
      return results;
    }
    return data;
  }, [comptes, journals, filters, needJournal]);

  // eslint-disable-next-line arrow-body-style
  const isInValid = useMemo(() => {
    console.log('dateIsValid', dateIsValid);
    return (
      !compte ||
      !imputation ||
      !piece ||
      (piece && piece.length < 12) ||
      !libelle ||
      (!+debit && !+credit)
    );
  }, [dateIsValid, compte, imputation, devise, piece, libelle, debit, credit]);

  const handleDeviseChange = (event) => {
    setDevise(event.target.value);
  };
  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleClear = useCallback(() => {
    setDate(new Date());
    setCompte(null);
    setImputation(null);
    setLibelle('');
    setDebit('');
    setCredit('');
    compteRef.current?.focus();
  }, []);

  const handleClearAll = useCallback(
    async (confirm = true) => {
      if (writings && writings.length) {
        let r = { response: 0 };
        if (confirm) {
          r = await dialog.showMessageBox({
            type: 'question',
            title: 'Annuler',
            message: 'Etes vous sûr de vouloir tout annuler sans enregistrer ?',
            buttons: ['Oui', 'Non']
          });
        }

        if (r.response === 0) {
          handleClear();
          cleardWriting();
          setPiece('');
          setDevise(DEFAULT_DEVISE);
        }
      }
    },
    [writings]
  );

  const handleAddWritting = useCallback(() => {
    if (isInValid) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'Veillez renseignez tous les champs'
      });
      return;
    }
    const data = {
      date,
      compte,
      imputation,
      devise,
      piece,
      libelle,
      montant: +debit || +credit,
      type: +debit ? 'D' : 'C',
      category
    };
    addWriting(data);
    handleClear();
  }, [
    date,
    compte,
    category,
    imputation,
    devise,
    piece,
    libelle,
    debit,
    credit,
    isInValid,
    handleClear
  ]);

  const handleSaveWrittings = useCallback(async () => {
    if (writings && writings.length) {
      const solde =
        getWritingsSum(writings, 'D') - getWritingsSum(writings, 'C');

      if (solde !== 0) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Ecriture',
          message: 'Ecritures non équilibrée !'
        });
        return;
      }

      const result = await saveWriting();
      if (!result.error) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Ecriture',
          message: 'Ecritures validées !'
        });
        handleClearAll(false);
      }
    }
  }, [saveWriting, writings, needJournal]);

  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography
              sx={{ marginBottom: 2 }}
              variant="h4"
              component="div"
              color="primary"
            >
              {title}
            </Typography>
            <Stack spacing={2}>
              <Stack spacing={2} direction="row">
                <Autocomplete
                  fullWidth
                  autoHighlight
                  autoSelect
                  id="combo-box-compte"
                  value={compte}
                  onChange={(event, newValue) => {
                    setCompte(newValue);
                  }}
                  options={filtredComptes}
                  // eslint-disable-next-line arrow-body-style
                  getOptionLabel={(option) => {
                    return `${option.compte} ${option.intitule}`;
                  }}
                  sx={{ width: 400 }}
                  renderOption={(renderProps, option) => [
                    renderProps,
                    <Stack spacing={2} direction="row">
                      <Typography
                        variant="caption"
                        component="div"
                        color="primary"
                      >
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
                      label="Compte"
                      name="compte"
                      fullWidth
                      size="small"
                      inputRef={compteRef}
                      onKeyDown={(event) => {
                        console.log(dateRef.current);
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          dateRef.current?.focus();
                        }
                      }}
                    />
                  )}
                  filterOptions={filterOptions}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                />
                <DesktopDatePicker
                  label="Date"
                  inputFormat="DD/MM/yyyy"
                  value={date}
                  onChange={handleDateChange}
                  inputRef={dateRef}
                  maxDate={moment()}
                  onError={() => setDateIsValid(false)}
                  onAccept={() => setDateIsValid(true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="date"
                      size="small"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          if (writings && writings.length) {
                            imputationRef.current?.focus();
                          } else {
                            pieceRef.current?.focus();
                          }
                        }
                      }}
                    />
                  )}
                />
                <TextField
                  id="piece"
                  name="piece"
                  label="Piéce"
                  error={piece && piece.length < 12}
                  helperText={
                    piece && piece.length < 12 ? 'Piéce non valide' : ''
                  }
                  variant="outlined"
                  size="small"
                  disabled={writings && writings.length}
                  value={piece}
                  onChange={(event) => {
                    setPiece(event.target.value.toUpperCase());
                  }}
                  InputProps={{
                    inputComponent: TextMaskCustom
                  }}
                  inputRef={pieceRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      imputationRef.current?.focus();
                    }
                  }}
                />
                <Autocomplete
                  fullWidth
                  autoHighlight
                  autoSelect
                  value={imputation}
                  onChange={(event, newValue) => {
                    setImputation(newValue);
                  }}
                  id="combo-box-imputations"
                  options={comptes}
                  // eslint-disable-next-line arrow-body-style
                  getOptionLabel={(option) => {
                    return `${option.compte} ${option.intitule}`;
                  }}
                  sx={{ width: 400 }}
                  renderOption={(renderProps, option) => [
                    renderProps,
                    <Stack spacing={2} direction="row">
                      <Typography
                        variant="caption"
                        component="div"
                        color="primary"
                      >
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
                      label="Imputations"
                      fullWidth
                      size="small"
                      inputRef={imputationRef}
                      name="imputation"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          libelleRef.current?.focus();
                        }
                      }}
                    />
                  )}
                  filterOptions={filterOptions}
                  disableListWrap
                  PopperComponent={StyledPopper}
                  ListboxComponent={ListboxComponent}
                />
              </Stack>
              <Stack
                spacing={2}
                direction="row"
                // divider={<Divider orientation="vertical" flexItem />}
              >
                <TextField
                  id="libelle"
                  label="Libellé"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={libelle}
                  onChange={(event) => {
                    setLibelle(event.target.value.toUpperCase());
                  }}
                  inputRef={libelleRef}
                  name="libelle"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;

                      if (writings && writings.length) {
                        debitRef.current?.focus();
                      } else {
                        deviseRef.current?.focus();
                      }
                    }
                  }}
                />

                <TextField
                  sx={{ width: 250 }}
                  id="devise"
                  inputRef={deviseRef}
                  name="devise"
                  select
                  label="Devise"
                  disabled={writings && writings.length}
                  variant="outlined"
                  size="small"
                  value={devise}
                  onChange={handleDeviseChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      debitRef.current?.focus();
                    }
                  }}
                >
                  <MenuItem value="cdf_cdf">CDF</MenuItem>
                  <MenuItem value="usd_cdf">USD</MenuItem>
                  <MenuItem value="eur_cdf">EUR</MenuItem>
                  <MenuItem value="cfa_cdf">CFA</MenuItem>
                </TextField>

                <TextField
                  id="debit"
                  name="debit"
                  label="Débit"
                  variant="outlined"
                  size="small"
                  value={debit}
                  onChange={(event) => {
                    setDebit(event.target.value);
                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!credit) setCredit('');
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom
                  }}
                  sx={{ width: 400 }}
                  inputRef={debitRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      creditRef.current?.focus();
                    }
                  }}
                />
                <TextField
                  id="credit"
                  name="credit"
                  label="Crédit"
                  variant="outlined"
                  size="small"
                  value={credit}
                  onChange={(event) => {
                    setCredit(event.target.value);
                    // eslint-disable-next-line no-extra-boolean-cast
                    if (!!debit) setDebit('');
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom
                  }}
                  sx={{ width: 400 }}
                  inputRef={creditRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      handleAddWritting();
                    }
                  }}
                />
                <Box>
                  <Stack spacing={1} direction="row">
                    <Fab
                      color="primary"
                      aria-label="add"
                      size="small"
                      onClick={() => handleClear()}
                    >
                      <CloseIcon />
                    </Fab>
                    <Fab
                      color="secondary"
                      aria-label="add"
                      size="small"
                      disabled={isInValid}
                      onClick={() => handleAddWritting()}
                    >
                      <AddIcon />
                    </Fab>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleSaveWrittings()}
              >
                Confirmer
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleClearAll()}
              >
                Annuler
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

DailyToolbar.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  filters: PropTypes.array,
  writings: PropTypes.array,
  needJournal: PropTypes.bool,
  addWriting: PropTypes.func,
  cleardWriting: PropTypes.func,
  saveWriting: PropTypes.func
};

export default DailyToolbar;
