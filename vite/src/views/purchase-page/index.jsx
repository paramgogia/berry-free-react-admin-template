// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Purchase from 'views/dashboard/harshit/purchases';
// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <MainCard title="Purchases">
    <Purchase />
  </MainCard>
);

export default SamplePage;
