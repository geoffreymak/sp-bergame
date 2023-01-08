/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import { useSelector } from 'react-redux';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

const AccountProfileDetails = (props) => {
  const user = useSelector((state) => state.user.data);
  const [values, setValues] = useState({
    username: user && user.username,
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
        <CardHeader subheader="Gestion de mon compte" title="Mon Compte" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                name="username"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passse actuelle"
                name="oldPassword"
                onChange={handleChange}
                required
                value={values.oldPassword}
                variant="outlined"
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                name="newPassword"
                onChange={handleChange}
                required
                value={values.newPassword}
                variant="outlined"
                type="password"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button color="primary" variant="contained">
            Modifier
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;
