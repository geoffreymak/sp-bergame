/* eslint-disable */
import React, { useState, useMemo, useCallback, useRef } from 'react';
// eslint-disable-next-line object-curly-newline
import { Box, Card, CardContent, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Autocomplete, {
  autocompleteClasses,
  createFilterOptions
} from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { VariableSizeList } from 'react-window';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';

import { addCompte } from '../redux/compte/compteSlice';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');

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

const ACCOUNT_TYPE = [
  { value: 'A', label: 'Compte à Chéval' },
  { value: 'D', label: 'Compte de Débit' },
  { value: 'C', label: 'Compte de Crédit' }
];
const DailyToolbar = (props) => {
  const { title, corresponds } = props;

  const [compte, setCompte] = useState(null);
  const [intitule, setIntitule] = useState('');
  const [type, setType] = useState(null);
  const dispatch = useDispatch();
  // const [refCompte, setRefCompte] = useState(null);
  // const [corresp, setCorresp] = useState(null);

  // const CompteRef = useRef(null);
  // const correspRef = useRef(null);
  const compteRef = useRef(null);
  const intituleRef = useRef(null);
  const typeRef = useRef(null);

  const isInValid = useMemo(() => {
    return !compte || !type || !intitule;
  }, [compte, type, intitule]);

  const handleClear = useCallback(() => {
    setCompte('');
    setIntitule('');
    setType(null);
    compteRef.current?.focus();
  }, []);

  const handleAddCompte = useCallback(async () => {
    if (!isInValid) {
      const data = {
        compte,
        type: type?.value,
        intitule
      };
      const response = await ipcRenderer.invoke('add-accompte', data);
      if (!response.error) {
        handleClear();
        dispatch(addCompte(JSON.parse(response.data)));
        dialog.showMessageBox({
          type: 'info',
          title: 'Enregistrement',
          message: 'Compte enregistré !'
        });
      }
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'Veillez renseignez tous les champs !'
      });
    }
  }, [compte, intitule, type, isInValid]);

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

            <Stack spacing={3}>
              <Stack
                spacing={2}
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <TextField
                  id="outlined-basic"
                  label="Compte"
                  fullWidth
                  inputRef={compteRef}
                  value={compte}
                  onChange={(event) => {
                    setCompte(event.target.value.toUpperCase());
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      intituleRef.current?.focus();
                    }
                  }}
                  variant="outlined"
                  size="small"
                />
                {/* <TextField
                  id="outlined-basic"
                  label="Reference Compte"
                  variant="outlined"
                  inputRef={refCompteRef}
                  value={refCompte}
                  onChange={(event) => {
                    setRefCompte(event.target.value.toUpperCase());
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      correspRef.current?.focus();
                    }
                  }}
                  size="small"
                  fullWidth
                /> */}

                <TextField
                  id="outlined-basic"
                  label="Intitulé"
                  inputRef={intituleRef}
                  value={intitule}
                  onChange={(event) => {
                    setIntitule(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      typeRef.current?.focus();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <Autocomplete
                  fullWidth
                  autoHighlight
                  autoSelect
                  id="combo-box-compte"
                  value={type}
                  onChange={(event, newValue) => {
                    setType(newValue);
                  }}
                  options={ACCOUNT_TYPE}
                  // eslint-disable-next-line arrow-body-style
                  getOptionLabel={(option) => {
                    return `${option.label}`;
                  }}
                  sx={{ width: 1500 }}
                  renderOption={(renderProps, option) => [
                    renderProps,
                    <Stack spacing={2} direction="row">
                      <Typography
                        variant="caption"
                        component="div"
                        color="primary"
                      >
                        {option.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        color="indigo"
                        noWrap
                      >
                        {option.label}
                      </Typography>
                    </Stack>
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type de compte"
                      name="type"
                      fullWidth
                      size="small"
                      inputRef={typeRef}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          // eslint-disable-next-line no-param-reassign
                          event.defaultMuiPrevented = true;
                          handleAddCompte();
                          intituleRef.current?.focus();
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
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                color="success"
                disabled={isInValid}
                onClick={() => handleAddCompte()}
              >
                Confirmer
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleClear()}
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
  corresponds: PropTypes.array
};

export default DailyToolbar;
