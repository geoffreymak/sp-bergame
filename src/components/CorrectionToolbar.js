/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable */
import React, { useState, useMemo, useCallback, useRef } from 'react';
// eslint-disable-next-line object-curly-newline
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';
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
import InputAdornment from '@mui/material/InputAdornment';
import NumberFormat from 'react-number-format';
import Popper from '@mui/material/Popper';
import { useSelector } from 'react-redux';
import { VariableSizeList } from 'react-window';
import { IMaskInput } from 'react-imask';
import moment from 'moment';
import { ceil } from 'lodash';
// eslint-disable-next-line import/named
import { getComptesStartsWith, getWritingsSum } from '../utils/comptes';

const { dialog } = window.require('@electron/remote');
const { ipcRenderer } = window.require('electron');

const DEFAULT_type = 'cdf_cdf';

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

const CodeMask = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0a"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

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

const formatXlsxData = (data) => {
  return data.map((d) => {
    if (
      d.DATE &&
      d.CODE &&
      d.IMPUTATION &&
      d.TYPE &&
      d.PIECE &&
      d.PARITE &&
      d.TAUX &&
      d.LIBELLE &&
      (d.Montant_FC || d.M_Dollar || d.Euro)
    ) {
      let date = new Date(d.DATE);
      date.setHours(date.getHours() + 1);
      let compte = { compte: d.CODE.substr(2) };
      let codeCompte = d.CODE.substr(0, 2);
      let imputation = { compte: d.IMPUTATION.substr(2) };
      let codeImputation = d.IMPUTATION.substr(0, 2);
      let type = d.TYPE.toUpperCase();
      let devise = d.Montant_FC ? 'cdf' : d.M_Dollar ? 'usd' : 'eur';
      let piece = d.PIECE;
      let parite = d.PARITE;
      let taux = d.TAUX;
      let libelle = d.LIBELLE;
      let montantUSD = d.M_Dollar || 0;
      let montantCDF = d.Montant_FC || 0;
      let montantEUR = d.Euro || 0;
      let EUR = d.Total_Euro || 0;

      return {
        date,
        compte,
        codeCompte: codeCompte.toUpperCase(),
        imputation,
        codeImputation: codeImputation.toUpperCase(),
        type,
        devise,
        piece,
        parite,
        taux,
        libelle,
        montantUSD,
        montantCDF,
        montantEUR,
        EUR
      };
    }
    return null;
  });
};
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

const getMontant = (euro, devise, taux, parite) => {
  let curTaux = 1;

  switch (devise) {
    case 'cdf':
      curTaux = taux;
      break;
    case 'usd':
      curTaux = parite;
      break;
    default:
      break;
  }
  return ceil(euro * curTaux, 2);
};

const CorrectionToolbar = (props) => {
  const [date, setDate] = useState(null);
  const [piece, setPiece] = useState('');
  const [parite, setParite] = useState('');
  const [taux, setTaux] = useState('');
  const [codeCompte, setCodeCompte] = useState('');
  const [compte, setCompte] = useState(null);
  const [codeImputation, setCodeImputation] = useState('');
  const [imputation, setImputation] = useState(null);
  const [type, setType] = useState('D');
  const [devise, setDevise] = useState('cdf');
  const [montant, setMontant] = useState('');
  const [libelle, setLibelle] = useState('');

  const dateRef = useRef(null);
  const pieceRef = useRef(null);
  const pariteRef = useRef(null);
  const tauxRef = useRef(null);
  const codeCompteRef = useRef(null);
  const compteRef = useRef(null);
  const codeImputationRef = useRef(null);
  const imputationRef = useRef(null);
  const typeRef = useRef(null);
  const deviseRef = useRef(null);
  const montantRef = useRef(null);
  const libelleRef = useRef(null);

  const comptes = useSelector((state) => state.comptes.data);
  const exercices = useSelector((state) => state.exercices.data);

  React.useEffect(() => {
    if (exercices) {
      const t = moment();
      setDate(moment(`${t.month() + 1}-${t.date()}-${exercices[0]?.code}`));
    }
  }, [exercices]);

  const hasValidDate = React.useMemo(() => {
    const year = moment(date).year();
    return exercices[0]?.code === year;
  }, [date, exercices]);

  // eslint-disable-next-line object-curly-newline
  const {
    title,
    category,
    filters,
    needJournal,
    writings,
    writing,
    setWriting,
    addWriting,
    setManyWriting,
    cleardWriting,
    saveWriting,
    correctWriting,
    addOneWriting,
    onSelectPiece,
    pieces
  } = props;

  React.useEffect(() => {
    if (writing) {
      const {
        date,
        piece,
        compte,
        compte_code,
        imputation,
        imputation_code,
        libelle,
        taux,
        parite,
        montant_usd,
        montant_cdf,
        montant_eur,
        montant_total_eur,
        type
      } = writing;

      const devise =
        (montant_cdf && 'cdf') ||
        (montant_usd && 'usd') ||
        (montant_eur && 'eur');

      setDate(moment(date));
      setPiece(piece);
      setParite(parite);
      setTaux(taux);
      setCodeCompte(compte.substr(0, 2));
      setCompte(comptes.find((c) => c.compte === compte_code));
      setCodeImputation(imputation.substr(0, 2));
      setImputation(comptes.find((c) => c.compte === imputation_code));
      setType(type);
      setDevise(devise);
      setMontant(getMontant(montant_total_eur, devise, taux, parite));
      setLibelle(libelle);
    }
  }, [writing]);

  const montants = useMemo(() => {
    let montantUSD = 0;
    let montantCDF = 0;
    let montantEUR = 0;
    let EUR = 0;
    let curTaux = 1;

    switch (devise) {
      case 'cdf':
        curTaux = taux;
        break;
      case 'usd':
        curTaux = parite;
        break;
      default:
        break;
    }
    if (parite && montant && taux) {
      montantUSD = devise === 'usd' ? montant : 0;
      montantCDF = devise === 'cdf' ? montant : 0;
      montantEUR = devise === 'eur' ? montant : 0;
      EUR = montant / curTaux;
    }
    return { montantUSD, montantCDF, montantEUR, EUR };
  }, [montant, parite, taux, devise]);

  // eslint-disable-next-line arrow-body-style
  const filtredComptes = useMemo(() => {
    const data = comptes;
    if (!!data && !!filters && !!filters.length) {
      let results = [];
      filters.forEach((filter) => {
        results = [...results, ...getComptesStartsWith(data, filter)];
      });
      return results;
    }
    return data;
  }, [comptes, filters, needJournal]);

  // eslint-disable-next-line arrow-body-style
  const isInValid = useMemo(() => {
    return (
      !compte ||
      !imputation ||
      !piece ||
      !libelle ||
      !parite ||
      !taux ||
      !codeCompte ||
      (codeCompte && codeCompte.length < 2) ||
      !codeImputation ||
      (codeImputation && codeImputation.length < 2) ||
      !montant
    );
  }, [
    compte,
    imputation,
    piece,
    libelle,
    parite,
    taux,
    codeCompte,
    codeImputation,
    montant
  ]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleDeviseChange = (event) => {
    setDevise(event.target.value);
  };
  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleClear = useCallback(() => {
    setDate(
      moment(`${moment().month() + 1}-${moment().date()}-${exercices[0]?.code}`)
    );
    setCompte(null);
    setImputation(null);
    setWriting(null);
    setLibelle('');
    setMontant('');
    setCodeImputation('');
    setCodeCompte('');
    codeCompteRef.current?.focus();
  }, [exercices]);

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
          setParite('');
          setTaux('');
        }
      }
    },
    [writings]
  );
  const handleLaodXlsx = useCallback(async () => {
    const response = await ipcRenderer.invoke('load-xlsx');
    if (!response.error) {
      const data = JSON.parse(response.data);
      let formatedData = formatXlsxData(data);
      formatedData = formatedData.map((d) => {
        const year = moment(d.date).year();
        return exercices[0]?.code === year ? d : null;
      });
      if (formatedData.includes(null)) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Importation Excel',
          message:
            'Veillez renseignez correctement les case dans votre fichier excel ou verifier que les date sont conforment !'
        });
        return;
      }

      setManyWriting(formatedData);
      console.log('load-xlsx', formatXlsxData(data));
    }
  }, [exercices]);

  const handleOpenXlsx = useCallback(async () => {
    const path = await ipcRenderer.invoke('xlsx-path');

    dialog.showOpenDialog(null, {
      defaultPath: path,
      title: 'Saisir depuis Excel',
      filters: [
        { name: 'Excel', extensions: ['xlsx'], properties: ['openFile'] }
      ]
    });
  }, []);

  const handleAddWritting = useCallback(() => {
    if (!hasValidDate) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'La date saisie est invalid !'
      });
      return;
    }

    if (isInValid) {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'Veillez renseignez correctement les champs !'
      });
      return;
    }
    const data = {
      date,
      compte,
      codeCompte,
      imputation,
      codeImputation,
      type,
      devise,
      piece,
      parite,
      taux,
      libelle,
      ...montants
    };

    if (writing) {
      addOneWriting(data);
    } else {
      addWriting(data);
    }

    handleClear();
  }, [
    date,
    compte,
    codeCompte,
    imputation,
    codeImputation,
    type,
    piece,
    parite,
    taux,
    devise,
    montants,
    libelle,
    isInValid,
    hasValidDate,
    handleClear,
    writing
  ]);

  const handleSaveWrittings = useCallback(async () => {
    if (writings && parite) {
      const solde = ceil(
        getWritingsSum(writings, 'D') - getWritingsSum(writings, 'C')
      );

      if (solde !== 0) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Ecriture',
          message: 'Ecritures non équilibrée !'
        });
        return;
      }

      const r = await dialog.showMessageBox({
        type: 'question',
        title: 'Correction piece',
        message: 'Êtes vous sûr de vouloir corriger cette piece ?',
        buttons: ['Oui', 'Non']
      });

      console.log(r);

      if (r.response === 0) {
        const result = await correctWriting();
        if (!result.error) {
          handleClearAll(false);
          dialog.showMessageBox({
            type: 'info',
            title: 'Correction écritures',
            message: 'Écritures corrigées !'
          });
        } else {
          dialog.showMessageBox({
            type: 'info',
            title: 'Correction écritures',
            message: 'Écritures non corrigées une erreur a été rencontré'
          });
        }
      }
    }
  }, [correctWriting, , writings, parite]);

  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                sx={{ marginBottom: 2 }}
                variant="h4"
                component="div"
                color="primary"
              >
                {title}
              </Typography>
              {/* <Button
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => handleOpenXlsx()}
              >
                Saisir les ecritures depuis excel
              </Button> */}
            </Stack>
            {/* <Divider /> */}
            <Stack spacing={1}>
              <Stack spacing={1} direction="row">
                <Autocomplete
                  fullWidth
                  autoHighlight
                  autoSelect
                  value={piece}
                  onChange={(event, newValue) => {
                    handleClearAll(false);
                    onSelectPiece(newValue);
                    setPiece(newValue);
                  }}
                  id="combo-box-imputations-239"
                  options={pieces}
                  // eslint-disable-next-line arrow-body-style

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Piéce"
                      fullWidth
                      size="small"
                      inputRef={pieceRef}
                      name="piece"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          dateRef.current?.focus();
                        }
                      }}
                    />
                  )}
                  disableListWrap
                />

                <DesktopDatePicker
                  label="Date"
                  inputFormat="DD/MM/yyyy"
                  value={date}
                  onChange={handleDateChange}
                  inputRef={dateRef}
                  minDate={moment(`01-01-${exercices[0]?.code}`)}
                  maxDate={moment(`12-31-${exercices[0]?.code}`)}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      name="date"
                      size="small"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          pariteRef.current?.focus();
                        }
                      }}
                    />
                  )}
                />

                <TextField
                  id="parite"
                  name="parite"
                  label="Parité"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={parite}
                  onChange={(event) => {
                    setParite(event.target.value);
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    endAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    )
                  }}
                  inputRef={pariteRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      tauxRef.current?.focus();
                    }
                  }}
                />
                <TextField
                  id="taux"
                  name="taux"
                  label="Taux"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={taux}
                  onChange={(event) => {
                    setTaux(event.target.value);
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    endAdornment: (
                      <InputAdornment position="end">Fc</InputAdornment>
                    )
                  }}
                  inputRef={tauxRef}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      codeCompteRef.current?.focus();
                      // handleAddWritting();
                    }
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                direction="row"
                // divider={<Divider orientation="vertical" flexItem />}
              >
                <Stack spacing={0} direction="row" sx={{ width: 400 }}>
                  <TextField
                    id="codeCompte"
                    name="codeCompte"
                    label="Code"
                    variant="outlined"
                    size="small"
                    value={codeCompte}
                    onChange={(event) => {
                      setCodeCompte(event.target.value.toLocaleUpperCase());
                    }}
                    InputProps={{
                      inputComponent: CodeMask
                    }}
                    sx={{ width: 100 }}
                    inputRef={codeCompteRef}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        // eslint-disable-next-line no-param-reassign
                        event.defaultMuiPrevented = true;
                        compteRef.current?.focus();
                      }
                    }}
                  />
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
                            typeRef.current?.focus();
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

                <TextField
                  sx={{ width: 250 }}
                  id="type"
                  inputRef={typeRef}
                  name="type"
                  select
                  label="Type"
                  // disabled={writings && writings.length}
                  variant="outlined"
                  size="small"
                  value={type}
                  onChange={handleTypeChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      codeImputationRef.current?.focus();
                    }
                  }}
                >
                  <MenuItem value="D">Débit</MenuItem>
                  <MenuItem value="C">Crédit</MenuItem>
                </TextField>

                <Stack spacing={0} direction="row" sx={{ width: 400 }}>
                  <TextField
                    id="codeImputation"
                    name="codeImputation"
                    label="Code"
                    variant="outlined"
                    size="small"
                    value={codeImputation}
                    onChange={(event) => {
                      setCodeImputation(event.target.value.toLocaleUpperCase());
                    }}
                    InputProps={{
                      inputComponent: CodeMask
                    }}
                    sx={{ width: 100 }}
                    inputRef={codeImputationRef}
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
                    id="combo-box-imputations-6"
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
                            deviseRef.current?.focus();
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

                <TextField
                  sx={{ width: 250 }}
                  id="devise"
                  inputRef={deviseRef}
                  name="devise"
                  select
                  label="Devise"
                  // disabled={writings && writings.length}
                  variant="outlined"
                  size="small"
                  value={devise}
                  onChange={handleDeviseChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      libelleRef.current?.focus();
                    }
                  }}
                >
                  <MenuItem value="cdf"> Fc (Franc congolais)</MenuItem>
                  <MenuItem value="usd"> $ (Dollar)</MenuItem>
                  <MenuItem value="eur"> € (Euro)</MenuItem>
                </TextField>
              </Stack>

              <Stack
                spacing={1}
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
                    setLibelle(event.target.value);
                  }}
                  inputRef={libelleRef}
                  name="libelle"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line no-param-reassign
                      event.defaultMuiPrevented = true;
                      montantRef.current?.focus();
                      // handleAddWritting();
                    }
                  }}
                />
                <TextField
                  id="montant"
                  name="montant"
                  label="Montant"
                  variant="outlined"
                  size="small"
                  value={montant}
                  onChange={(event) => {
                    setMontant(event.target.value);
                  }}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    endAdornment: (
                      <InputAdornment position="end">
                        {getDevise(devise)}
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 400 }}
                  inputRef={montantRef}
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
                      onClick={() => handleClearAll(false)}
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
          <CardActions sx={{ width: '100%', justifyContent: 'space-between' }}>
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
            {/* <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={() => handleLaodXlsx()}
              >
                Récupérer les ecritures depuis excel
              </Button>
            </Stack> */}
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

CorrectionToolbar.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
  filters: PropTypes.array,
  writings: PropTypes.array,
  needJournal: PropTypes.bool,
  addWriting: PropTypes.func,
  cleardWriting: PropTypes.func,
  saveWriting: PropTypes.func
};

export default CorrectionToolbar;
