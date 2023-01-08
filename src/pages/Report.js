import { Helmet } from 'react-helmet';
// import Stack from '@mui/material/Stack';
import ReportList from '../components/report/ReportList';

const Report = () => (
  <>
    <Helmet>
      <title>Rapports</title>
    </Helmet>
    <ReportList />
  </>
);

export default Report;
