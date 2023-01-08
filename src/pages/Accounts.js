import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import AccountToolbar from '../components/AccountToolbar';
import AccountTable from '../components/AccountTable';
// import customers from '../__mocks__/customers';

const Accounts = () => {
  const comptes = useSelector((state) => state.comptes.data);
  // const corresponds = useSelector((state) => state.correspond.data);
  return (
    <>
      <Helmet>
        <title>Compte</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <AccountToolbar title="Comptes" />
          <Box sx={{ pt: 3 }}>
            <AccountTable comptes={comptes} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Accounts;
