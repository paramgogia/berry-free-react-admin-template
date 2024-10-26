import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';

const SalesForecast = () => {
  // 10-day forecast data
  const data = [
    {"date":"25-10-2024","lstm_forecast":22270.29819,"xgb_forecast":22253.70075,"ensemble_forecast":22261.99947,"day_of_week":"Friday","month":"October","year":2024},
    {"date":"26-10-2024","lstm_forecast":22273.34353,"xgb_forecast":22251.80321,"ensemble_forecast":22262.57337,"day_of_week":"Saturday","month":"October","year":2024},
    {"date":"27-10-2024","lstm_forecast":22274.26028,"xgb_forecast":22253.70075,"ensemble_forecast":22263.98052,"day_of_week":"Sunday","month":"October","year":2024},
    {"date":"28-10-2024","lstm_forecast":22275.86769,"xgb_forecast":22253.70075,"ensemble_forecast":22264.78422,"day_of_week":"Monday","month":"October","year":2024},
    {"date":"29-10-2024","lstm_forecast":22277.17537,"xgb_forecast":22253.70075,"ensemble_forecast":22265.43806,"day_of_week":"Tuesday","month":"October","year":2024},
    {"date":"30-10-2024","lstm_forecast":22278.53476,"xgb_forecast":22253.70075,"ensemble_forecast":22266.11776,"day_of_week":"Wednesday","month":"October","year":2024},
    {"date":"31-10-2024","lstm_forecast":22279.82423,"xgb_forecast":22253.70075,"ensemble_forecast":22266.76249,"day_of_week":"Thursday","month":"October","year":2024},
    {"date":"01-11-2024","lstm_forecast":22281.08889,"xgb_forecast":22253.70075,"ensemble_forecast":22267.39482,"day_of_week":"Friday","month":"November","year":2024},
    {"date":"02-11-2024","lstm_forecast":22282.31476,"xgb_forecast":22253.70075,"ensemble_forecast":22268.00776,"day_of_week":"Saturday","month":"November","year":2024},
    {"date":"03-11-2024","lstm_forecast":22283.50891,"xgb_forecast":22253.70075,"ensemble_forecast":22268.60483,"day_of_week":"Sunday","month":"November","year":2024}
  ];

  // Format number to 2 decimal places
  const formatNumber = (num) => Number(num).toFixed(2);

  // Calculate comprehensive statistics
  const getStats = () => {
    const lstm = data.map(d => d.lstm_forecast);
    const xgb = data.map(d => d.xgb_forecast);
    const ensemble = data.map(d => d.ensemble_forecast);

    return {
      lstm: {
        avg: formatNumber(lstm.reduce((a, b) => a + b, 0) / lstm.length),
        min: formatNumber(Math.min(...lstm)),
        max: formatNumber(Math.max(...lstm)),
        growth: formatNumber(((lstm[lstm.length - 1] - lstm[0]) / lstm[0]) * 100)
      },
      xgb: {
        avg: formatNumber(xgb.reduce((a, b) => a + b, 0) / xgb.length),
        min: formatNumber(Math.min(...xgb)),
        max: formatNumber(Math.max(...xgb)),
        growth: formatNumber(((xgb[xgb.length - 1] - xgb[0]) / xgb[0]) * 100)
      },
      ensemble: {
        avg: formatNumber(ensemble.reduce((a, b) => a + b, 0) / ensemble.length),
        min: formatNumber(Math.min(...ensemble)),
        max: formatNumber(Math.max(...ensemble)),
        growth: formatNumber(((ensemble[ensemble.length - 1] - ensemble[0]) / ensemble[0]) * 100)
      }
    };
  };

  const stats = getStats();
  const [activeChart, setActiveChart] = React.useState('line');

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Sales Forecast Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600">Avg LSTM Forecast</div>
          <div className="text-2xl font-bold text-blue-600">{stats.lstm.avg}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600">Avg XGB Forecast</div>
          <div className="text-2xl font-bold text-green-600">{stats.xgb.avg}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600">Avg Ensemble Forecast</div>
          <div className="text-2xl font-bold text-orange-600">{stats.ensemble.avg}</div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 rounded ${activeChart === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Line Chart
        </button>
        <button 
          onClick={() => setActiveChart('bar')}
          className={`px-4 py-2 rounded ${activeChart === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Bar Chart
        </button>
        <button 
          onClick={() => setActiveChart('area')}
          className={`px-4 py-2 rounded ${activeChart === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Area Chart
        </button>
      </div>

      {/* Charts */}
      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lstm_forecast" stroke="#8884d8" name="LSTM Forecast" />
              <Line type="monotone" dataKey="xgb_forecast" stroke="#82ca9d" name="XGB Forecast" />
              <Line type="monotone" dataKey="ensemble_forecast" stroke="#ff7300" name="Ensemble Forecast" />
            </LineChart>
          ) : activeChart === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Bar dataKey="lstm_forecast" fill="#8884d8" name="LSTM Forecast" />
              <Bar dataKey="xgb_forecast" fill="#82ca9d" name="XGB Forecast" />
              <Bar dataKey="ensemble_forecast" fill="#ff7300" name="Ensemble Forecast" />
            </BarChart>
          ) : (
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="lstm_forecast" fill="#8884d8" stroke="#8884d8" name="LSTM Forecast" />
              <Area type="monotone" dataKey="xgb_forecast" fill="#82ca9d" stroke="#82ca9d" name="XGB Forecast" />
              <Area type="monotone" dataKey="ensemble_forecast" fill="#ff7300" stroke="#ff7300" name="Ensemble Forecast" />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Detailed Summary Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">10-Day Forecast Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold mb-4 text-blue-600">LSTM Model Analysis</h3>
            <ul className="space-y-2">
              <li>Average: {stats.lstm.avg}</li>
              <li>Minimum: {stats.lstm.min}</li>
              <li>Maximum: {stats.lstm.max}</li>
              <li>Growth Rate: {stats.lstm.growth}%</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-green-600">XGBoost Model Analysis</h3>
            <ul className="space-y-2">
              <li>Average: {stats.xgb.avg}</li>
              <li>Minimum: {stats.xgb.min}</li>
              <li>Maximum: {stats.xgb.max}</li>
              <li>Growth Rate: {stats.xgb.growth}%</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-orange-600">Ensemble Model Analysis</h3>
            <ul className="space-y-2">
              <li>Average: {stats.ensemble.avg}</li>
              <li>Minimum: {stats.ensemble.min}</li>
              <li>Maximum: {stats.ensemble.max}</li>
              <li>Growth Rate: {stats.ensemble.growth}%</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-bold mb-2">Key Insights:</h3>
          <ul className="space-y-2">
            <li>• LSTM shows the most dynamic predictions with a growth rate of {stats.lstm.growth}%</li>
            <li>• XGBoost predictions are more stable, showing minimal variation</li>
            <li>• Ensemble model balances both approaches, with moderate growth of {stats.ensemble.growth}%</li>
            <li>• The difference between highest and lowest predictions is relatively small, suggesting stable market conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalesForecast;