import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// ==============================|| DASHBOARD DEFAULT - STOCK OUTAGE FORECAST ||============================== //

const PopularCard = ({ isLoading }) => {
  const [data, setData] = useState([]);

  // Dummy data for now
  const dummyData = [
    { id: '1', productName: 'Laptop', daysUntilOutage: 3, demandRate: 20 },
    { id: '2', productName: 'Smartphone', daysUntilOutage: 7, demandRate: 15 },
    { id: '3', productName: 'Tablet', daysUntilOutage: 12, demandRate: 10 },
    { id: '4', productName: 'Headphones', daysUntilOutage: 18, demandRate: 8 },
    { id: '5', productName: 'Smartwatch', daysUntilOutage: 30, demandRate: 5 }
  ];

  // Fetch data using Axios (for future backend connection)
  const fetchData = async () => {
    try {
      // Use dummy data for now
      setData(dummyData);

      // For future backend connection, replace the line above with the following:
      // const response = await axios.get('/api/your-endpoint');
      // setData(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Define color indicator based on remaining days
  const getColorByDaysRemaining = (days) => {
    if (days <= 5) return { bgColor: '#ffcccb', color: '#b22222' }; // light red background, dark red text
    if (days <= 15) return { bgColor: '#ffe4b5', color: '#ff8c00' }; // light orange background, dark orange text
    return { bgColor: '#d0f0c0', color: '#228b22' }; // light green background, dark green text
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h4">Stock Outage Forecast</Typography>
              </Grid>
              {data.map((item) => {
                const { bgColor, color } = getColorByDaysRemaining(item.daysUntilOutage);

                return (
                  <Grid item xs={12} key={item.id}>
                    <Grid container direction="column">
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" color="textPrimary">
                            {item.productName}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" color="textPrimary">
                            {item.daysUntilOutage} days
                          </Typography>
                        </Grid>
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '5px',
                            bgcolor: bgColor,
                            color: color,
                            ml: 2
                          }}
                        />
                      </Grid>
                      <Typography variant="subtitle2" sx={{ color: color }}>
                        {item.demandRate} units/day
                      </Typography>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
