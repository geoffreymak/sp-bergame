import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import JournalToolbar from '../components/JournalToolbar';
import JournalTable from '../components/JournalTable';
// import customers from '../__mocks__/customers';

const Daily = () => {
  const journals = useSelector((state) => state.journals.data);
  return (
    <>
      <Helmet>
        <title>Journal</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <JournalToolbar title="Journal" />
          <Box sx={{ pt: 3 }}>
            <JournalTable journals={journals} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Daily;
