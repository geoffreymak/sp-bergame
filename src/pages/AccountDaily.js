import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import DailyToolbar from '../components/DailyToolbar';
import DailyTable from '../components/DailyTable';
import useWriting from '../hooks/useWriting';
// import customers from '../__mocks__/customers';

const AccountDaily = () => {
  // eslint-disable-next-line object-curly-newline
  const { writings, addWriting, cleardWriting, saveWriting } = useWriting();
  return (
    <>
      <Helmet>
        <title>Journal de Banque</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <DailyToolbar
            title="Journal de Banque"
            filters={['52', '56']}
            addWriting={addWriting}
            writings={writings}
            category="ACCOUNT"
            cleardWriting={cleardWriting}
            saveWriting={saveWriting}
          />
          <Box sx={{ pt: 3 }}>
            <DailyTable writings={writings} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AccountDaily;
