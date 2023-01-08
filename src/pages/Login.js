/* eslint-disable  */
import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import { Box, Button, Container } from '@material-ui/core';
import { setUser } from '../redux/user/userSlice';

const { ipcRenderer } = window.require('electron');

const Login = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      const response = await ipcRenderer.invoke('get-users');
      if (!response.error) {
        setUsers(JSON.parse(response.data));
      }
    };
    getUsers();
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!!currentUser && currentUser?.password === password) {
        console.log(currentUser);
        dispatch(setUser(currentUser));
        history.push('/app/home');
      } else {
        if (!currentUser) {
          setUsernameError(true);
        } else {
          setPasswordError(true);
        }
      }
    },
    [currentUser, password]
  );

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    LOGIN
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="overline"
                  >
                    {'SOEURS DES PAUVRES DE BERGAME'}
                  </Typography>
                </Box>

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={users}
                  getOptionLabel={(option) => option.username}
                  value={currentUser}
                  onChange={(event, newValue) => {
                    setCurrentUser(newValue);
                    usernameError && setUsernameError(false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Utilisateur"
                      margin="normal"
                      name="username"
                      variant="outlined"
                      size="medium"
                      error={usernameError}
                      helperText={
                        usernameError
                          ? 'Veillez selectionner un utilisateur !'
                          : ''
                      }
                    />
                  )}
                />

                <TextField
                  error={passwordError}
                  fullWidth
                  helperText={passwordError ? 'Mot de passe incorrect !' : ''}
                  label="Mot de Passe"
                  margin="normal"
                  name="password"
                  size="medium"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    passwordError && setPasswordError(false);
                  }}
                  type="password"
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Se connecter
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
