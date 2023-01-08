import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import JournalToolbar from '../components/JournalToolbar';
import JournalTable from '../components/JournalTable';
// import customers from '../__mocks__/customers';

const Correspond = () => {
  const entites = useSelector((state) => state.entites.data);
  return (
    <>
      <Helmet>
        <title>Communautés</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <JournalToolbar title="Communautés" correspond />
          <Box sx={{ pt: 3 }}>
            <JournalTable journals={entites} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Correspond;
