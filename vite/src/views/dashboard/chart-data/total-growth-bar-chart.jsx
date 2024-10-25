// ==============================|| DASHBOARD - SALES PER MONTH BAR CHART ||============================== //

// Dummy data for each category
const dummyCategorySalesData = {
  electronics: [{ name: 'Sales', data: [150, 200, 180, 250, 220, 300, 280, 270, 300, 320, 310, 290] }],
  fashion: [{ name: 'Sales', data: [80, 90, 75, 100, 120, 150, 170, 160, 140, 130, 110, 100] }],
  'home-appliances': [{ name: 'Sales', data: [60, 70, 65, 80, 95, 110, 130, 125, 105, 100, 90, 85] }],
  books: [{ name: 'Sales', data: [200, 210, 180, 220, 230, 250, 240, 230, 220, 210, 205, 195] }]
};

// Function to get chart data for the selected category
const getChartDataForCategory = (category, dataSource = dummyCategorySalesData) => ({
  height: 480,
  type: 'bar',
  options: {
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
      show: true,
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    },
    title: {
      text: `Monthly Sales for ${category.charAt(0).toUpperCase() + category.slice(1)}`
    }
  },
  series: dataSource[category] || []
});

export default getChartDataForCategory;
