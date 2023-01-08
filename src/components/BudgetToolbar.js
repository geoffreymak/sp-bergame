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
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';

import { addEntite } from '../redux/entite/entiteSlice';
// import { addCorrespond } from '../redux/correspond/correspondSlice';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');

const BudgetToolbar = (props) => {
  const { title, onEntiteChange, entite, exercice, onExerciceChange } = props;
  const entites = useSelector((state) => state.entites.data);
  const exercices = useSelector((state) => state.exercices.data);

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
              <Stack spacing={2} direction="row" alignItems="flex-start">
                <Autocomplete
                  id="combo-box-demo"
                  options={exercices}
                  disabled
                  getOptionLabel={(option) => `${option.libelle}`}
                  value={exercice}
                  onChange={(event, newValue) => {
                    onExerciceChange(newValue);
                  }}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Exercice"
                      name="exercice"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />

                <Autocomplete
                  id="combo-box-demo"
                  options={entites}
                  getOptionLabel={(option) =>
                    `${option.code} ${option.intitule}`
                  }
                  size="small"
                  fullWidth
                  value={entite}
                  onChange={(event, newValue) => {
                    onEntiteChange(newValue);
                  }}
                  renderOption={(renderProps, option) => [
                    <Stack spacing={2} direction="row" {...renderProps}>
                      <Typography
                        variant="caption"
                        component="div"
                        color="primary"
                      >
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
                      inputRef={intituleRef}
                      fullWidth
                      label="Communauté"
                      name="entite"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Stack>
            </Stack>
          </CardContent>
          {/* <Divider />
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
          </CardActions> */}
        </Card>
      </Box>
    </Box>
  );
};

BudgetToolbar.propTypes = {
  title: PropTypes.string,
  entite: PropTypes.object,
  onEntiteChange: PropTypes.func,
  exercice: PropTypes.object,
  onExerciceChange: PropTypes.func
};

export default BudgetToolbar;
