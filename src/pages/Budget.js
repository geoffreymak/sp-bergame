/* eslint-disable arrow-body-style */
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import BudgetToolbar from '../components/BudgetToolbar';
import BudgetTable from '../components/BudgetTable';

// import DeviseTable from '../components/DeviseTable';
// import customers from '../__mocks__/customers';

const Budget = () => {
  const comptes = useSelector((state) => state.comptes.data);
  const budgets = useSelector((state) => state.budget.data);
  const [entite, setEntite] = React.useState(null);
  const [exercice, setExercice] = React.useState(null);
  const exercices = useSelector((state) => state.exercices.data);

  React.useEffect(() => {
    if (exercices && exercices.length) {
      setExercice(exercices[0]);
    }
  }, [exercices]);

  const handleEntiteChange = (newEntite) => setEntite(newEntite);
  const onExerciceChange = (newEntite) => setExercice(newEntite);

  const formatedComptes = React.useMemo(() => {
    if (entite && comptes) {
      const budget = budgets?.filter(
        (b) => b.entite === entite?.code && b.exercice === exercice?.code
      );
      return comptes?.map((c) => {
        const currBudget = budget?.find((b) => b.compte === c.compte) || {};
        const data = {
          ...c,
          id: c.compte,
          ...currBudget
        };

        return data;
      });
    }
    return [];
  }, [comptes, entite, exercice, budgets]);

  // const devises = useSelector((state) => state.devises.list);
  return (
    <>
      <Helmet>
        <title>Suivie budgetaire</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="md">
          <BudgetToolbar
            title="Saisie lignes budgetaires"
            entite={entite}
            exercice={exercice}
            onEntiteChange={handleEntiteChange}
            onExerciceChange={onExerciceChange}
          />
          <Box sx={{ pt: 3 }}>
            <BudgetTable
              comptes={formatedComptes}
              entite={entite}
              exercice={exercice}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Budget;
