/* eslint-disable operator-linebreak */
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
// import DailyToolbar from '../components/DailyToolbar';
import CorrectionToolbar from '../components/CorrectionToolbar';
import DailyTable from '../components/DailyTable';
import ProgressDialog from '../components/ProgressDialog';

import useWriting from '../hooks/useWriting';
// import customers from '../__mocks__/customers';

const { ipcRenderer } = window.require('electron');

const CorrectionJournal = () => {
  const [writing, setWriting] = useState(null);
  const [piece, setPiece] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbWrintings, setDbWrintings] = useState([]);
  // eslint-disable-next-line object-curly-newline
  const {
    writings,
    addWriting,
    removeWriting,
    setManyWriting,
    setWritings,
    cleardWriting,
    saveWriting,
    correctWriting,
    addOneWriting
  } = useWriting();

  const handleRowDoubleClick = (row) => {
    console.log('row', row);
    setWriting(row);
    removeWriting(row?.id);
  };

  useEffect(() => {
    const getWritings = async () => {
      setLoading(true);
      const response = await ipcRenderer.invoke('get-writings');
      if (!response.error && !!response.data) {
        setDbWrintings(JSON.parse(response.data));
      }
      setLoading(false);
    };
    getWritings();
  }, []);

  useEffect(() => {
    setWritings([]);
    if (piece && dbWrintings) {
      setWritings(
        dbWrintings
          .filter((w) => w.piece === piece)
          .map((w) => ({ ...w, id: w.uuid }))
      );
    }
  }, [piece, dbWrintings]);

  const pieces = useMemo(() => {
    if (dbWrintings) {
      return [...new Set(dbWrintings.map((w) => w.piece))].sort();
    }
    return [];
  }, [dbWrintings]);

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
          <CorrectionToolbar
            title="Journal des corrections"
            needJournal
            correctWriting={() => correctWriting(piece)}
            addWriting={addWriting}
            onSelectPiece={setPiece}
            pieces={pieces}
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
      <ProgressDialog title="Chargement des écritures" open={loading} />
    </>
  );
};

export default CorrectionJournal;
