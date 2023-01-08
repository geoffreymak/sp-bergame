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
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import moment from 'moment';
import { useDispatch } from 'react-redux';

// import { addDevise } from '../redux/devise/deviseSlice';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');

const DeviseToollbar = (props) => {
  const { title } = props;

  const [date, setDate] = useState(moment());
  const [usd, setUsd] = useState('');
  const [eur, setEur] = useState('');
  const [cfa, setCfa] = useState('');
  const dispatch = useDispatch();

  const dateRef = useRef(null);
  const usdRef = useRef(null);
  const eurRef = useRef(null);
  const cfaRef = useRef(null);

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const isInValid = useMemo(() => {
    return !date || !usd || !eur || !cfa;
  }, [date, usd, eur, cfa]);

  const handleClear = useCallback(() => {
    setUsd('');
    setEur('');
    setCfa('');
    dateRef.current?.focus();
  }, []);

  const handleAddCompte = useCallback(async () => {
    if (!isInValid) {
      const data = {
        date: moment(date).format(),
        usd_cdf: usd,
        eur_cdf: eur,
        cfa_cdf: cfa
      };
      const response = await ipcRenderer.invoke('add-devise', data);
      if (!response.error) {
        handleClear();
        // dispatch(addDevise(JSON.parse(response.data)));
        dialog.showMessageBox({
          type: 'info',
          title: 'Enregistrement',
          message: 'Devise enregistré !'
        });
      }
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'Veillez renseignez tous les champs !'
      });
    }
  }, [date, usd, eur, cfa, isInValid]);

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
                <DesktopDatePicker
                  label="Date"
                  inputFormat="DD/MM/yyyy"
                  value={date}
                  onChange={handleDateChange}
                  inputRef={dateRef}
                  maxDate={moment()}
                  disabled
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="date"
                      size="small"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.defaultMuiPrevented = true;
                          usdRef.current?.focus();
                        }
                      }}
                    />
                  )}
                />
                <TextField
                  id="outlined-basic"
                  label="USD => CDF"
                  variant="outlined"
                  inputRef={usdRef}
                  value={usd}
                  onChange={(event) => {
                    setUsd(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      eurRef.current?.focus();
                    }
                  }}
                  size="small"
                />
                <TextField
                  id="outlined-basic"
                  label="EUR => CDF"
                  inputRef={eurRef}
                  value={eur}
                  onChange={(event) => {
                    setEur(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      cfaRef.current?.focus();
                    }
                  }}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  id="outlined-basic"
                  label="CFA => CDF"
                  inputRef={cfaRef}
                  value={cfa}
                  onChange={(event) => {
                    setCfa(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleAddCompte();
                    }
                  }}
                  variant="outlined"
                  size="small"
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

DeviseToollbar.propTypes = {
  title: PropTypes.string
};

export default DeviseToollbar;
