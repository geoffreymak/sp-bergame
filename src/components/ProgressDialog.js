/* eslint-disable react/prop-types */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';

import Box from '@mui/material/Box';

function ProgressDialog(props) {
  const { open, onClose, title } = props;

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={5}
          >
            <Typography>{title ? title : 'Affichage du rapport'}</Typography>
            {onClose && (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Veillez patienter un moment
          </DialogContentText>
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

ProgressDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string
};

export default ProgressDialog;
