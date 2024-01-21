/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';

import { Box, Button, Card, CardContent, CardHeader } from '@material-ui/core';

// import '@grapecity/activereports/styles/ar-js-viewer.css';
// import {} from '@grapecity/activereports-localization';
// import { Viewer } from '@grapecity/activereports-react';
// import {
//   PdfExport,
//   HtmlExport,
//   XlsxExport,
//   Core
// } from '@grapecity/activereports';

import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';

import GeneralBalanceDialog from './GeneralBalanceDialog';
// import AuxilairyBalanceDialog from './AuxilairyBalanceDialog';
import GrdLivreDialog from './GrdLivreDialog';
// import BilanDialog from './BilanDialog';
// import TableauExpDialog from './TableauExpDialog';
// import ResultAccountDialog from './ResultAccountDialog';
// import BilanV2Dialog from './BilanV2Dialog';
import JournalDialog from './JournalDialog';
import CashReportDialog from './CashReportDialog';
import BudgetDialog from './BudgetDialog';
import BilanDialog from './NewBilanDialog';
import ProgressDialog from '../ProgressDialog';
// import TableauCorDialog from './TableauCorDialog';
// import ProgressDialog from '../ProgressDialog';

import './report.css';

export const BALANCE_GENERALE = 'balance_generale';
export const BALANCE_GENERALE_CORRESPOND = 'balance_generale_correspond';
export const BALANCE_AUXILIAIRE = 'balance_auxiliaire';
export const GRAND_LIVRE = 'grand_livre';
export const GRAND_LIVRE_AUXILIAIRE = 'grand_livre_auxiliaire';
export const BILAN = 'bilan';
export const TABLEAU_EXPLOITAION = 'tableau_exploitation';
export const LISTE_COMPTES = 'liste_comptes';
export const JOURNAL = 'journal';
export const JOURNAUX = 'journaux';
export const CASH_REPORT = 'cash_report';
export const BUDGET = 'budget';
export const COMPTE_RESULTAT = 'compte_resultat';
export const BILAN_ACTIF = 'bilan_actif';
export const BILAN_PASSIF = 'bilan_passif';
export const TABLEAU_CORRESPONDANCE = 'tableau_correspondance';

const { ipcRenderer } = window.require('electron');

const ReportList = (props) => {
  const [report, setReport] = useState('');
  const [openGenBal, setOpenGenBal] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [openGrdLivre, setOpenGrdLivre] = useState(false);
  const [openJournaux, setOpenJournaux] = useState(false);
  const [openJournal, setOpenJournal] = useState(false);
  const [openListeCompte, setOpenListeCompte] = useState(false);
  const [openCashReport, setOpenCashReport] = useState(false);
  const [openAuxBal, setOpenAuxBal] = useState(false);
  const [openBilan, setOpenBialan] = useState(false);
  const [openTableauExp, setOpenTableauExp] = useState(false);
  const [openTableauCor, setOpenTableauCor] = useState(false);
  const [openResultAct, setOpenResultAct] = useState(false);
  const [openBilanAct, setOpenBialanAct] = useState(false);
  const [openBilanPas, setOpenBialanPas] = useState(false);
  const [exercice, setExercice] = useState(null);
  const [progress, setProgress] = useState(false);
  const [oldExercice, setOldExercice] = useState(false);

  const handleChangeOldExercice = (event) => {
    setOldExercice(event.target.checked);
  };
  const exercices = useSelector((state) => state.exercices.data);

  useEffect(() => {
    if (!oldExercice && !!exercices) {
      setExercice(exercices[0]);
    }
  }, [oldExercice, exercices]);

  useEffect(() => {
    const printRequest = async () => {
      if (openJournaux) {
        const printData = {
          type: JOURNAUX,
          title: 'LISTE DES JOURNAUX',
          smallTitle: true
        };
        try {
          const response = await ipcRenderer.invoke('print', printData);
        } catch (error) {
        } finally {
          setOpenJournaux(false);
        }
      }

      if (openListeCompte) {
        const printData = {
          type: LISTE_COMPTES,
          title: 'PLAN COMPTABLE',
          smallTitle: true
        };
        try {
          const response = await ipcRenderer.invoke('print', printData);
        } catch (error) {
        } finally {
          setOpenListeCompte(false);
        }
      }
    };
    printRequest();
  }, [openJournaux, openListeCompte]);

  const handleReportChange = (event) => {
    setReport(event.target.value);
  };

  const handleConfirm = useCallback(() => {
    switch (report) {
      case BALANCE_GENERALE:
        setOpenGenBal(true);
        break;
      case GRAND_LIVRE:
        setOpenGrdLivre(true);
        break;
      case LISTE_COMPTES:
        setOpenListeCompte(true);
        break;
      case JOURNAL:
        setOpenJournal(true);
        break;
      case CASH_REPORT:
        setOpenCashReport(true);
        break;
      case BUDGET:
        setOpenBudget(true);
        break;
      case BILAN:
        setOpenBialan(true);
        break;

      default:
        break;
    }
  }, [report]);

  const handleProgressChange = (progress) => {
    setProgress(progress);
  };

  // if (true) {
  //   return (
  //     <div id="designer-host">
  //       <Viewer
  //         report={{ Uri: 'Test.rdlx-json' }}
  //         sidebarVisible={true}
  //         toolbarVisible={true}
  //         language="fr"
  //       />
  //     </div>
  //   );
  // }

  return (
    <>
      <form {...props}>
        <Card>
          <CardHeader title="Rapports" />
          <Divider />
          <CardContent>
            <Stack
              spacing={2}
              divider={<Divider orientation="horizontal" flexItem />}
            >
              <Stack
                direction={'row'}
                spacing={3}
                alignItems={'center'}
                // divider={<Divider orientation="horizontal" flexItem />}
              >
                <Autocomplete
                  id="combo-box-demo"
                  options={exercices}
                  getOptionLabel={(option) => `${option.libelle}`}
                  value={exercice}
                  disabled={!oldExercice}
                  onChange={(event, newValue) => {
                    setExercice(newValue);
                  }}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Exercice"
                      margin="normal"
                      name="exercice"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={oldExercice}
                        onChange={handleChangeOldExercice}
                      />
                    }
                    label="Voir les rapport des exercices passé !"
                  />
                </FormGroup>
              </Stack>

              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Choisir le Rapport à afficher
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="radio-buttons-group"
                  value={report}
                  onChange={handleReportChange}
                >
                  <Stack
                    direction="row"
                    spacing={3}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Stack>
                      <FormControlLabel
                        value={BALANCE_GENERALE}
                        control={<Radio />}
                        label="Balance generale des comptes"
                      />
                      {/* <FormControlLabel
                      value={BALANCE_GENERALE_CORRESPOND}
                      control={<Radio />}
                      label="Balance generale par correspondance"
                    /> */}
                      {/* <FormControlLabel
                      value={BALANCE_AUXILIAIRE}
                      control={<Radio />}
                      label="Balance auxiliaire des comptes"
                    /> */}
                      <FormControlLabel
                        value={GRAND_LIVRE}
                        control={<Radio />}
                        label="Grand livre des comptes"
                      />
                      <FormControlLabel
                        value={JOURNAL}
                        control={<Radio />}
                        label="Journal"
                      />

                      <FormControlLabel
                        value={LISTE_COMPTES}
                        control={<Radio />}
                        label="Liste de comptes"
                      />

                      {/* <FormControlLabel
                      value={TABLEAU_EXPLOITAION}
                      control={<Radio />}
                      label="Tableau d'exploitation"
                    /> */}
                    </Stack>
                    <Stack>
                      <FormControlLabel
                        value={BILAN}
                        control={<Radio />}
                        label="Bilan"
                      />

                      {/* <FormControlLabel
                      value={JOURNAUX}
                      control={<Radio />}
                      label="Journaux"
                    /> */}
                      <FormControlLabel
                        value={CASH_REPORT}
                        control={<Radio />}
                        label="Rapport de caisse"
                      />
                      <FormControlLabel
                        value={BUDGET}
                        control={<Radio />}
                        label="Suivies budgetaires"
                      />
                      {/* <FormControlLabel
                      value={COMPTE_RESULTAT}
                      control={<Radio />}
                      label="Compte de resultats"
                    /> */}
                      {/* <FormControlLabel
                      value={BILAN_ACTIF}
                      control={<Radio />}
                      label="Bilan actif"
                    /> */}
                      {/* <FormControlLabel
                      value={BILAN_PASSIF}
                      control={<Radio />}
                      label="Bilan passif"
                    /> */}
                      {/* <FormControlLabel
                      value={TABLEAU_CORRESPONDANCE}
                      control={<Radio />}
                      label="Tableau de correspondance des differentes..."
                    /> */}
                    </Stack>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Stack>
          </CardContent>
          {/* <Divider /> */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleConfirm()}
            >
              Confirmer
            </Button>
          </Box>
        </Card>
      </form>
      {/* <GeneralBalanceDialog
        open={openGenBal || openGenBalCor}
        onClose={() => {
          setOpenGenBal(false);
          setOpenGenBalCor(false);
        }}
        type={openGenBal ? BALANCE_GENERALE : BALANCE_GENERALE_CORRESPOND}
      /> */}
      {/* <AuxilairyBalanceDialog
        open={openAuxBal}
        onClose={() => {
          setOpenAuxBal(false);
        }}
        type={BALANCE_AUXILIAIRE}
      /> */}
      <GrdLivreDialog
        open={openGrdLivre}
        onClose={() => {
          setOpenGrdLivre(false);
        }}
        type={GRAND_LIVRE}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />
      <GrdLivreDialog
        open={openGenBal}
        onClose={() => {
          setOpenGenBal(false);
        }}
        type={BALANCE_GENERALE}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />
      <CashReportDialog
        open={openCashReport}
        onClose={() => {
          setOpenCashReport(false);
        }}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />
      <BudgetDialog
        open={openBudget}
        onClose={() => {
          setOpenBudget(false);
        }}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />
      <JournalDialog
        open={openJournal}
        onClose={() => {
          setOpenJournal(false);
        }}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />
      <ProgressDialog open={progress} onClose={() => setProgress(false)} />

      <BilanDialog
        open={openBilan}
        onClose={() => {
          setOpenBialan(false);
        }}
        exercice={exercice}
        handleProgressChange={handleProgressChange}
      />

      {/* <TableauExpDialog
        open={openTableauExp}
        onClose={() => {
          setOpenTableauExp(false);
        }}
        type={TABLEAU_EXPLOITAION}
      /> */}
      {/* <TableauCorDialog
        open={openTableauCor}
        onClose={() => {
          setOpenTableauCor(false);
        }}
        type={TABLEAU_CORRESPONDANCE}
      /> */}
      {/* <ResultAccountDialog
        open={openResultAct}
        onClose={() => {
          setOpenResultAct(false);
        }}
        type={COMPTE_RESULTAT}
      /> */}
      {/* <BilanV2Dialog
        open={openBilanAct}
        onClose={() => {
          setOpenBialanAct(false);
        }}
        type={BILAN_ACTIF}
      /> */}
      {/* <BilanV2Dialog
        open={openBilanPas}
        onClose={() => {
          setOpenBialanPas(false);
        }}
        type={BILAN_PASSIF}
      /> */}

      {/* <ProgressDialog /> */}
    </>
  );
};

export default ReportList;
