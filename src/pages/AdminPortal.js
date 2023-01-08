import { Helmet } from 'react-helmet';
import Stack from '@mui/material/Stack';
import AdminPanel from '../components/AdminPanel';

const AdminPortal = () => (
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
        <AdminPanel />
      </Stack>
    </Stack>
  </>
);

export default AdminPortal;
