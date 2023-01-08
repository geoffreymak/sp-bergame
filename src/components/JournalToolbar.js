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
import { useDispatch } from 'react-redux';

import { addEntite } from '../redux/entite/entiteSlice';
// import { addCorrespond } from '../redux/correspond/correspondSlice';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');

const JournalToolbar = (props) => {
  const { title, correspond } = props;

  const [compte, setCompte] = useState('');
  const [intitule, setIntitule] = useState('');

  const dispatch = useDispatch();

  const compteRef = useRef(null);
  const intituleRef = useRef(null);

  const isInValid = useMemo(() => {
    return !compte || !intitule;
  }, [compte, intitule]);

  const handleClear = useCallback(() => {
    setCompte('');
    setIntitule('');
    compteRef.current && compteRef.current.focus();
  }, []);

  const handleAddCompte = useCallback(async () => {
    if (!isInValid) {
      const data = { code: compte, intitule };

      const response = await ipcRenderer.invoke('add-entite', data);
      if (!response.error) {
        handleClear();
        dispatch(addEntite(JSON.parse(response.data)));
        dialog.showMessageBox({
          type: 'info',
          title: 'Enregistrement',
          message: 'Opertion enregistré !'
        });
      }
    } else {
      dialog.showMessageBox({
        type: 'info',
        title: 'Enregistrement',
        message: 'Veillez renseignez tous les champs !'
      });
    }
  }, [compte, intitule, isInValid]);

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
                  label="Code"
                  fullWidth
                  inputRef={compteRef}
                  value={compte}
                  onChange={(event) => {
                    setCompte(event.target.value.toUpperCase());
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.defaultMuiPrevented = true;
                      intituleRef.current && intituleRef.current.focus();
                    }
                  }}
                  variant="outlined"
                  size="small"
                />

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
                      handleAddCompte();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  fullWidth
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

JournalToolbar.propTypes = {
  title: PropTypes.string,
  correspond: PropTypes.bool
};

export default JournalToolbar;
