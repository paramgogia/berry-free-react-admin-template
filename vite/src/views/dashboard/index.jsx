import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import Chatbot from './Chatbot';
import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [isChatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleChatbot = () => {
    setChatbotVisible((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <EarningCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <TotalOrderLineChartCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalIncomeDarkCard isLoading={isLoading} />
                </Grid>
                <Grid item sm={6} xs={12} md={6} lg={12}>
                  <TotalIncomeLightCard
                    {...{
                      isLoading: isLoading,
                      total: 203,
                      label: 'Total Income',
                      icon: <StorefrontTwoToneIcon fontSize="inherit" />
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Floating Chat Icon */}
      <IconButton
        onClick={toggleChatbot}
        color="primary"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width:'60px',
          height:'60px',
          zIndex: 1000,
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {isChatbotVisible ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
      </IconButton>

      {/* Chatbot Window */}
      {isChatbotVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 999,
            width: '400px',
            maxHeight: '400px',
            backgroundColor: '#f7f7f7',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
