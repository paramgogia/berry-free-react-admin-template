import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.layers import Input
import xgboost as xgb
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')

class SimpleSalesForecastSystem:
    def __init__(self, forecast_horizon=30, train_split=0.5, validation_split=0.25):
        self.forecast_horizon = forecast_horizon
        self.train_split = train_split
        self.validation_split = validation_split
        self.scaler = MinMaxScaler()
        self.models = {}
        self.metrics = {}
        self.lookback = 2  # Reduced lookback period for small datasets
    
    def process_data(self, df):
        """Initial data processing and analysis."""
        try:
            # Ensure datetime column exists
            if 'datetime' not in df.columns:
                # Convert timestamp if it exists
                if 'timestamp' in df.columns:
                    df['datetime'] = pd.to_datetime(df['timestamp'])
                    df.drop('timestamp', axis=1, inplace=True)
                else:
                    raise ValueError("DataFrame must contain either 'datetime' or 'timestamp' column")
            
            # Extract date from datetime
            df['date'] = pd.to_datetime(df['datetime']).dt.date
            
            # Print initial analysis
            print("\nPreprocessing Status:")
            print(f"Total records: {len(df)}")
            print(f"Date range: {df['date'].min()} to {df['date'].max()}")
            print(f"Number of unique days: {df['date'].nunique()}")
            
            return df
            
        except Exception as e:
            print(f"Error in processing data: {str(e)}")
            raise
        
    def prepare_data(self, df):
        """Prepare data for analysis and modeling."""
        print("\nInitial Data Shape:", df.shape)
        
        # Aggregate daily sales
        daily_sales = df.groupby('date')['total'].sum().reset_index()
        daily_sales['date'] = pd.to_datetime(daily_sales['date'])
        daily_sales = daily_sales.sort_values('date')
        
        # Handle missing dates
        date_range = pd.date_range(start=daily_sales['date'].min(), end=daily_sales['date'].max())
        daily_sales = daily_sales.set_index('date').reindex(date_range).interpolate(method='linear').reset_index()
        daily_sales.columns = ['date', 'sales']
        
        # Scale the data
        scaled_data = self.scaler.fit_transform(daily_sales['sales'].values.reshape(-1, 1))
        
        # Print analysis
        print(f"\nData Analysis:")
        print(f"Total days of data: {len(daily_sales)}")
        print(f"Date range: {daily_sales['date'].min()} to {daily_sales['date'].max()}")
        print(f"Average daily sales: {daily_sales['sales'].mean():.2f}")
        print(f"Total sales in period: {daily_sales['sales'].sum():.2f}")
        
        # Additional analysis
        print("\nSales Statistics:")
        print(f"Minimum daily sales: {daily_sales['sales'].min():.2f}")
        print(f"Maximum daily sales: {daily_sales['sales'].max():.2f}")
        print(f"Standard deviation: {daily_sales['sales'].std():.2f}")
        
        return daily_sales, scaled_data
    
    def create_sequences(self, data):
        """Create sequences for time series models."""
        X, y = [], []
        for i in range(len(data) - self.lookback):
            X.append(data[i:(i + self.lookback), 0])
            y.append(data[i + self.lookback, 0])
        return np.array(X), np.array(y)
    
    def split_data(self, X, y):
        """Split data into train, validation, and test sets."""
        if len(X) < 2:
            raise ValueError(f"Insufficient data for splitting. Need at least {self.lookback + 2} days of data.")
            
        train_size = max(1, int(len(X) * self.train_split))
        val_size = max(1, int(len(X) * self.validation_split))
        
        X_train = X[:train_size]
        y_train = y[:train_size]
        
        X_val = X[train_size:train_size + val_size]
        y_val = y[train_size:train_size + val_size]
        
        X_test = X[train_size + val_size:]
        y_test = y[train_size + val_size:]
        
        # Ensure we have at least one sample in test set
        if len(X_test) == 0:
            X_test = X_val
            y_test = y_val
        
        print(f"\nData Split Status:")
        print(f"Training samples: {len(X_train)}")
        print(f"Validation samples: {len(X_val)}")
        print(f"Test samples: {len(X_test)}")
        
        return (X_train, y_train), (X_val, y_val), (X_test, y_test)
    
    def train_models(self, X, y):
        """Train both LSTM and XGBoost models."""
        # Split data
        (X_train, y_train), (X_val, y_val), (X_test, y_test) = self.split_data(X, y)
        
        # Train LSTM
        X_train_lstm = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
        X_val_lstm = X_val.reshape((X_val.shape[0], X_val.shape[1], 1))
        X_test_lstm = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))
        
        lstm_model = Sequential([
            Input(shape=(self.lookback, 1)),
            LSTM(20, activation='relu'),
            Dense(1)
        ])
        lstm_model.compile(optimizer='adam', loss='mse')
        
        print("\nTraining LSTM model...")
        lstm_history = lstm_model.fit(
            X_train_lstm, y_train,
            validation_data=(X_val_lstm, y_val),
            epochs=50,
            batch_size=1,
            verbose=1
        )
        
        # Train XGBoost
        print("\nTraining XGBoost model...")
        xgb_model = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=50,
            learning_rate=0.1,
            max_depth=3
        )
        xgb_model.fit(X_train, y_train)
        
        # Store models and calculate metrics
        self.models['lstm'] = lstm_model
        self.models['xgb'] = xgb_model
        
        self._calculate_metrics('lstm', lstm_model, X_test_lstm, y_test)
        self._calculate_metrics('xgb', xgb_model, X_test, y_test)
        
        print("\nModel Performance Metrics:")
        print(json.dumps(self.metrics, indent=2))
        
        return X_test, y_test
    
    def _calculate_metrics(self, model_name, model, X_test, y_test):
        """Calculate and store performance metrics."""
        if len(X_test) == 0:
            print(f"Warning: No test data available for {model_name} metrics calculation")
            return
            
        y_pred = model.predict(X_test)
        
        if model_name == 'lstm':
            y_pred = y_pred.reshape(-1, 1)
            y_test = y_test.reshape(-1, 1)
        
        y_pred_actual = self.scaler.inverse_transform(y_pred.reshape(-1, 1))
        y_test_actual = self.scaler.inverse_transform(y_test.reshape(-1, 1))
        
        self.metrics[model_name] = {
            'mse': float(mean_squared_error(y_test_actual, y_pred_actual)),
            'rmse': float(np.sqrt(mean_squared_error(y_test_actual, y_pred_actual))),
            'mae': float(mean_absolute_error(y_test_actual, y_pred_actual)),
            'r2': float(r2_score(y_test_actual, y_pred_actual))
        }
    
    def generate_forecasts(self, last_sequence):
        """Generate forecasts using both models."""
        start_date = datetime.now().date()
        future_dates = pd.date_range(start=start_date, periods=self.forecast_horizon)
        
        # Generate LSTM forecasts
        lstm_sequence = last_sequence.reshape(1, self.lookback, 1)
        lstm_forecasts = []
        
        for _ in range(self.forecast_horizon):
            pred = self.models['lstm'].predict(lstm_sequence, verbose=0)[0]
            lstm_forecasts.append(float(pred))
            lstm_sequence = np.roll(lstm_sequence, -1, axis=1)
            lstm_sequence[0, -1, 0] = float(pred)
        
        # Generate XGBoost forecasts
        xgb_sequence = last_sequence.reshape(1, -1)
        xgb_forecasts = []
        
        for _ in range(self.forecast_horizon):
            pred = self.models['xgb'].predict(xgb_sequence)[0]
            xgb_forecasts.append(float(pred))
            xgb_sequence = np.roll(xgb_sequence, -1)
            xgb_sequence[0, -1] = float(pred)
        
        # Inverse transform predictions
        lstm_forecasts = self.scaler.inverse_transform(np.array(lstm_forecasts).reshape(-1, 1))
        xgb_forecasts = self.scaler.inverse_transform(np.array(xgb_forecasts).reshape(-1, 1))
        
        # Create forecast DataFrame with additional features
        forecasts_df = pd.DataFrame({
            'date': future_dates,
            'lstm_forecast': lstm_forecasts.flatten(),
            'xgb_forecast': xgb_forecasts.flatten(),
            'ensemble_forecast': (lstm_forecasts.flatten() + xgb_forecasts.flatten()) / 2
        })
        
        # Add temporal features
        forecasts_df['day_of_week'] = forecasts_df['date'].dt.day_name()
        forecasts_df['month'] = forecasts_df['date'].dt.month_name()
        forecasts_df['year'] = forecasts_df['date'].dt.year
        
        return forecasts_df

def main():
    """Main function to run the forecasting system."""
    try:
        # Read and preprocess the data
        print("Loading and preprocessing data...")
        df = pd.read_csv('/kaggle/input/datasetofmumbaihackers/groc_sales.csv')
        
        # Initialize system
        system = SimpleSalesForecastSystem()
        
        # Process the data
        df = system.process_data(df)
        
        # Prepare data for modeling
        daily_sales, scaled_data = system.prepare_data(df)
        
        # Create sequences
        X, y = system.create_sequences(scaled_data)
        
        # Train models and get test data
        X_test, y_test = system.train_models(X, y)
        
        # Generate forecasts
        forecasts_df = system.generate_forecasts(X_test[-1])
        
        print("\nForecast Summary (Next 5 days):")
        print(forecasts_df.head())
        
        # Export forecasts to CSV
        output_file = 'sales_forecasts.csv'
        forecasts_df.to_csv(output_file, index=False)
        print(f"\nForecasts exported to: {output_file}")
        
        # Export daily sales history to CSV
        history_file = 'sales_history.csv'
        daily_sales.to_csv(history_file, index=False)
        print(f"Historical sales exported to: {history_file}")
        
        return forecasts_df, system.metrics, daily_sales
        
    except Exception as e:
        print(f"Error in main function: {str(e)}")
        return None, None, None

if __name__ == "__main__":
    forecasts, metrics, daily_sales = main()