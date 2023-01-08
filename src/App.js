/* eslint-disable no-extra-boolean-cast */
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useEffect, lazy, Suspense } from 'react';
// import { useRoutes } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateAdapter from '@mui/lab/AdapterMoment';
import { useSelector } from 'react-redux';
import 'moment/locale/fr';
import GlobalStyles from './components/GlobalStyles';
import Loader from './components/Loader';
import theme from './theme';

import useMainEvent from './hooks/useMainEvent';

const { ipcRenderer } = window.require('electron');

const Routes = lazy(() => import('./Routes'));

const App = () => {
  const user = useSelector((state) => state.user.data);
  useMainEvent();

  useEffect(() => {
    if (!!user) {
      ipcRenderer.send('init-data');
      console.log('initialized data');
    }
  }, [user]);

  return (
    <Suspense fallback={<Loader />}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <Routes />
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Suspense>
  );
};

export default App;
