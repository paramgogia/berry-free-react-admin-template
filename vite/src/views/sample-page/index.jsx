// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ProductTable from 'views/dashboard/harshit/ProductTable';
// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => (
  <MainCard title="Products">
    <ProductTable />
  </MainCard>
);

export default SamplePage;
