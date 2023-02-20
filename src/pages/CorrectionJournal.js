/* eslint-disable operator-linebreak */
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
// import DailyToolbar from '../components/DailyToolbar';
import DailyToolbarV2 from '../components/DailyToolbarV2';
import DailyTable from '../components/DailyTable';
import useWriting from '../hooks/useWriting';
// import customers from '../__mocks__/customers';

const CorrectionJournal = () => {
  // eslint-disable-next-line object-curly-newline
  const { writings, addWriting, setManyWriting, cleardWriting, saveWriting } =
    useWriting();

  return (
    <>
      <Helmet>
        <title>Journal des corrections</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <DailyToolbarV2
            title="Journal des corrections"
            needJournal
            addWriting={addWriting}
            writings={writings}
            category="VARIOUS"
            setManyWriting={setManyWriting}
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

export default CorrectionJournal;
