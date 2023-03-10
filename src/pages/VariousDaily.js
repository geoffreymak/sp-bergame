/* eslint-disable operator-linebreak */
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
// import DailyToolbar from '../components/DailyToolbar';
import DailyToolbarV2 from '../components/DailyToolbarV2';
import DailyTable from '../components/DailyTable';
import useWriting from '../hooks/useWriting';
// import customers from '../__mocks__/customers';

const VariousDaily = () => {
  const [writing, setWriting] = useState(null);
  // eslint-disable-next-line object-curly-newline
  const {
    writings,
    addWriting,
    removeWriting,
    setManyWriting,
    cleardWriting,
    saveWriting,
    addOneWriting
  } = useWriting();

  const handleRowDoubleClick = (row) => {
    console.log('row', row);
    setWriting(row);
    removeWriting(row?.id);
  };

  return (
    <>
      <Helmet>
        <title>Journal des operations diverses</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <DailyToolbarV2
            title="Journal des operations diverses"
            needJournal
            addWriting={addWriting}
            addOneWriting={addOneWriting}
            writing={writing}
            setWriting={setWriting}
            writings={writings}
            category="VARIOUS"
            setManyWriting={setManyWriting}
            cleardWriting={cleardWriting}
            saveWriting={saveWriting}
          />
          <Box sx={{ pt: 3 }}>
            <DailyTable
              writings={writings}
              onRowDoubleClick={handleRowDoubleClick}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default VariousDaily;
