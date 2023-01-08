/* eslint-disable react/no-unescaped-entities */
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
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import Draggable from 'react-draggable';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import moment from 'moment';
import { useSelector } from 'react-redux';

const { ipcRenderer } = window.require('electron');

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

function TableauExpDialog(props) {
  const { open, onClose, type } = props;
  const [date, setDate] = React.useState([moment(), moment()]);
  const [devise, setDevise] = React.useState('cdf_cdf');
  const [site, setSite] = React.useState(null);
  const sites = useSelector((state) => state.sites.data);
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        IMPRESSION DU TABLEAU D'EXPLOITATION
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={5} direction="row" justifyContent="space-between">
          <Stack spacing={1}>
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
              title: "TABLEAU D'EXPLOITATION",
              date: {
                fromDate: moment(date[0]).format(),
                toDate: moment(date[1]).format()
              },
              devise,
              category: '',
              smallTitle: true,
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

TableauExpDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.string
};

export default TableauExpDialog;
