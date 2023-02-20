import { Helmet } from 'react-helmet';
import Stack from '@mui/material/Stack';
import ReportList from '../components/report/ReportList';

const Report = () => (
  <>
    <Helmet>
      <title>Rapports</title>
    </Helmet>
    <Stack
      sx={{
        minHeight: '100%',
        py: 3
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack>
        <ReportList />
      </Stack>
    </Stack>
  </>
);

export default Report;
