import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import DailyToolbar from '../components/DailyToolbar';
import DailyTable from '../components/DailyTable';
import useWriting from '../hooks/useWriting';
// import customers from '../__mocks__/customers';

const CashDaily = () => {
  // eslint-disable-next-line object-curly-newline
  const { writings, addWriting, cleardWriting, saveWriting } = useWriting();
  return (
    <>
      <Helmet>
        <title>Journal de Caisse</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <DailyToolbar
            title="Journal de Caisse"
            filters={['57']}
            addWriting={addWriting}
            writings={writings}
            category="CASH"
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

export default CashDaily;
