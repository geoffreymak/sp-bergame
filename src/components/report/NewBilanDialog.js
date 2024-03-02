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
import InputAdornment from '@mui/material/InputAdornment';
import Popper from '@mui/material/Popper';
import NumberFormat from 'react-number-format';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import { VariableSizeList } from 'react-window';
import moment from 'moment';
import DatePicker from '@mui/lab/DatePicker';
import { useSelector } from 'react-redux';
import { getUniqueCompte } from '../../utils/comptes';

const { ipcRenderer } = window.require('electron');

export const BUDGET_MONTH = 'budget_month';
export const BUDGET_YEAR = 'budget_year';

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

function BilanDialog(props) {
  const { open, onClose, type, exercice, handleProgressChange } = props;

  const [entite, setEntite] = React.useState(null);

  const entites = useSelector((state) => state.entites.data);

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Impression du Bilan
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Autocomplete
          id="combo-box-demo"
          options={entites}
          getOptionLabel={(option) => `${option.code} ${option.intitule}`}
          value={entite}
          fullWidth
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
            />
          )}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            // eslint-disable-next-line implicit-arrow-linebreak
            if (!entite) return;
            const printData = {
              type: 'bilan',
              title: `BILAN EXERCICE ${exercice?.code}`,
              entite,
              exercice: exercice?.code,
              noSubtitle: true,
              smallTitle: true,
              customDevise: 'EUR (€)'
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

BilanDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string,
  exercice: PropTypes.object,
  handleProgressChange: PropTypes.func
};

export default BilanDialog;
