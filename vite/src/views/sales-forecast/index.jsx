// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SalesForecast from 'views/dashboard/harshit/sales-forecast';  
// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <MainCard title="Sales Forecast">
    <SalesForecast /> 
  </MainCard>
);

export default SamplePage;
