import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import getChartDataForCategory from './chart-data/total-growth-bar-chart';

const SalesPerMonthChart = ({ isLoading }) => {
  const [category, setCategory] = useState('electronics'); // Default category
  const [chartData, setChartData] = useState(getChartDataForCategory(category));
  const theme = useTheme();
  const useBackend = false; // Set to true to use backend data in the future

  useEffect(() => {
    if (useBackend) {
      // Placeholder for backend API call
      // e.g., fetch(`your-backend-api/sales?category=${category}`)
      //   .then(response => response.json())
      //   .then(data => {
      //      setChartData(getChartDataForCategory(category, data));
      //   });
    } else {
      setChartData(getChartDataForCategory(category)); // Use dummy data
    }
  }, [category, isLoading, useBackend]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="subtitle2">Sales per Month</Typography>
                  <Typography variant="h3">Category: {category}</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Select Category"
                  >
                    {[
                      { value: 'electronics', label: 'Electronics' },
                      { value: 'fashion', label: 'Fashion' },
                      { value: 'home-appliances', label: 'Home Appliances' },
                      { value: 'books', label: 'Books' }
                    ].map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

export default SalesPerMonthChart;
