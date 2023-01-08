/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';

import { Box, Card, CardContent, CardHeader } from '@material-ui/core';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import NavItem from './NavItem';
import NavItemButton from './NavItemButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import LockClockIcon from '@mui/icons-material/LockClock';
import PersonAddIcon from '@mui/icons-material/People';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import InboxIcon from '@mui/icons-material/Inbox';
import OutboxIcon from '@mui/icons-material/Outbox';

import ProgressDialog from './ProgressDialog';

// import ExportDialog from '../components/data/ExportDialog';
import { useSelector, useDispatch } from 'react-redux';

import { addExercice } from '../redux/exercice/exerciceSlice';

const { ipcRenderer } = window.require('electron');
const { dialog } = window.require('@electron/remote');

const AdminPanel = (props) => {
  const [openExport, setOpenExport] = useState(false);
  const [loadingClose, setLoadingClose] = useState(false);
  const dispatch = useDispatch();
  const exercices = useSelector((state) => state.exercices.data);
  const user = useSelector((state) => state.user.data);

  const handleCloseExercice = useCallback(async () => {
    let r = { response: 0 };
    r = await dialog.showMessageBox({
      type: 'warning',
      title: "Cloture de l'exercice",
      message:
        "Vous êtes sur le point de lancer le processus de cloture de l'exercice en cours. Sachez que, vous ne pourrez plus passer des écritures à cette exercice.\n\nCe processus est irréversible.\n\n\nEtes vous vraiment sûr de le faire ?",
      buttons: ['Oui', 'Non']
    });

    if (r.response === 0) {
      setLoadingClose(true);
      const response = await ipcRenderer.invoke('close-exercice', user);
      setLoadingClose(false);
      if (!response.error) {
        const data = JSON.parse(response.data);
        dispatch(addExercice(data));
        dialog.showMessageBox({
          type: 'info',
          title: "Cloture de l'exercice",
          message: 'Exercice cloturé !'
        });
      } else {
        dialog.showMessageBox({
          type: 'error',
          title: "Cloture de l'exercice",
          message: 'Exercice non cloturé !'
        });
      }
    }
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="Espace Administrateur" />
        <Divider />
        <CardContent>
          <Stack direction={'column'} spacing={1} sx={{ width: 300 }}>
            {/* <NavItem
              href={'/app/admin-create-user'}
              title={'Gestion Utilisateurs'}
              icon={PersonAddIcon}
            /> */}
            {user.attribut === 'A1' && (
              <NavItemButton
                onClick={() => handleCloseExercice()}
                title={'Cloture Exercice'}
                icon={LockClockIcon}
              />
            )}

            {/* <NavItemButton
              onClick={() => {}}
              title={'Importation Données'}
              icon={InboxIcon}
            />
            <NavItemButton
              onClick={() => setOpenExport(true)}
              title={'Exportation Données'}
              icon={OutboxIcon}
            /> */}

            {/* <Button onClick={exportData}>{'Exportation Données'}</Button> */}
          </Stack>
        </CardContent>
      </Card>
      {/* <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        exercice={exercices[0]}
      /> */}

      <ProgressDialog
        title="Cloture de l'exercice"
        open={loadingClose}
        onClose={() => setLoadingClose(false)}
      />
    </>
  );
};

export default AdminPanel;
