import pandas as pd
import numpy as np
from datetime import datetime
import google.generativeai as genai
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
import tensorflow.keras as keras
from tensorflow.keras.models import Model
import xgboost as xgb
from typing import Dict, List, Tuple
from IPython.display import display, clear_output
import ipywidgets as widgets

class SalesDataChatbot:
    """Interactive chatbot for querying sales data using Gemini."""
    
    def __init__(self, gemini_model):
        self.gemini = gemini_model
        self.context = """You are a sales data analyst assistant. Analyze the data and provide clear, 
        concise answers. Consider total sales, product categories, customer types, and payment methods 
        in your analysis. Always include relevant numbers and insights in your responses."""
    
    def query_data(self, df: pd.DataFrame, user_query: str) -> str:
        """Process user query about sales data."""
        try:
            # Prepare data summary for context
            data_summary = {
                'total_sales': df['total'].sum(),
                'avg_daily_sales': df['total'].mean(),
                'date_range': f"{df['date'].min()} to {df['date'].max()}",
                'peak_sales': df['total'].max(),
                'peak_sales_date': df.loc[df['total'].idxmax(), 'date'],
                'recent_trend': df.tail(7)['total'].tolist(),
                'top_categories': df.groupby('category')['total'].sum().nlargest(3).to_dict(),
                'customer_types': df['customer_type'].value_counts().to_dict(),
                'payment_methods': df['payment_type'].value_counts().to_dict()
            }
            
            prompt = f"""{self.context}
            
            Data Summary:
            - Total Sales: ${data_summary['total_sales']:,.2f}
            - Average Daily Sales: ${data_summary['avg_daily_sales']:,.2f}
            - Date Range: {data_summary['date_range']}
            - Peak Sales: ${data_summary['peak_sales']:,.2f} on {data_summary['peak_sales_date']}
            - Recent 7 days trend: {data_summary['recent_trend']}
            - Top Categories: {data_summary['top_categories']}
            - Customer Types: {data_summary['customer_types']}
            - Payment Methods: {data_summary['payment_methods']}
            
            User Question: {user_query}
            
            Provide a clear, data-driven response focusing on the specific question while incorporating relevant context."""

            response = self.gemini.generate_content(prompt)
            return response.text
            
        except Exception as e:
            return f"I encountered an error analyzing the data: {str(e)}"

class SalesInsightPipeline:
    """Combines Gemini's insights with LSTM-XGBoost ensemble forecasting."""
    
    def __init__(self, gemini_api_key: str, forecast_horizon: int = 30):
        # Initialize Gemini
        genai.configure(api_key=gemini_api_key)
        self.gemini = genai.GenerativeModel('gemini-pro')
        self.chatbot = SalesDataChatbot(self.gemini)
        
        # Initialize ML components
        self.forecast_horizon = forecast_horizon
        self.scaler = MinMaxScaler()
        self.lookback = 2
        self.models = {}
        self.metrics = {'lstm': {}, 'xgb': {}}
        
    def process_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process and enhance the raw sales data."""
        processed_df = df.copy()
        
        # Ensure datetime column exists
        if 'datetime' not in processed_df.columns:
            processed_df['datetime'] = pd.to_datetime(processed_df['timestamp'])
        
        # Extract date components
        processed_df['date'] = processed_df['datetime'].dt.date
        processed_df['day'] = processed_df['datetime'].dt.day
        processed_df['month'] = processed_df['datetime'].dt.month
        processed_df['year'] = processed_df['datetime'].dt.year
        processed_df['day_of_week'] = processed_df['datetime'].dt.dayofweek
        processed_df['hour'] = processed_df['datetime'].dt.hour
        
        # Create derived features
        processed_df['is_weekend'] = processed_df['day_of_week'].isin([5, 6]).astype(int)
        processed_df['is_holiday'] = self._identify_holidays(processed_df['date'])
        
        # Calculate rolling statistics
        daily_sales = processed_df.groupby('date')['total'].agg(['sum', 'count', 'mean']).reset_index()
        daily_sales['rolling_avg_7d'] = daily_sales['sum'].rolling(window=7, min_periods=1).mean()
        daily_sales['rolling_std_7d'] = daily_sales['sum'].rolling(window=7, min_periods=1).std()
        
        # Merge daily stats back to main dataframe
        processed_df = processed_df.merge(daily_sales, on='date', how='left')
        
        return processed_df
    
    def _identify_holidays(self, dates) -> pd.Series:
        """Simple holiday identification - can be enhanced with holiday API."""
        # Placeholder for holiday identification
        # Returns a series of 0s with the same index as dates
        return pd.Series(0, index=range(len(dates)))
    
    def prepare_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, np.ndarray]:
        """Prepare data for time series forecasting."""
        # Group by date and sum total sales
        daily_sales = df.groupby('date')['total'].sum().reset_index()
        daily_sales = daily_sales.sort_values('date')
        
        # Scale the data
        sales_scaled = self.scaler.fit_transform(daily_sales[['total']])
        print("Shape of daily_sales:", daily_sales.shape)  # Print shape of daily_sales DataFrame
        print("Shape of sales_scaled:", sales_scaled.shape)  # Print shape of scaled data

        
        return daily_sales, sales_scaled
    
    def create_sequences(self, scaled_data: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Create sequences for LSTM training."""
        X, y = [], []
        for i in range(len(scaled_data) - self.lookback):
            X.append(scaled_data[i:(i + self.lookback), 0])
            y.append(scaled_data[i + self.lookback, 0])
        
        return np.array(X), np.array(y)
        
    def split_data(self, X: np.ndarray, y: np.ndarray) -> Tuple:
        # First split into train+val and test
        X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.05, train_size=0.95, shuffle=False) 

        # Then split train+val into train and val
        X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.05, train_size=0.9, shuffle=False)  

        # Reshape data for LSTM
        X_train = X_train.reshape(-1, self.lookback, 1)
        X_val = X_val.reshape(-1, self.lookback, 1)
        X_test = X_test.reshape(-1, self.lookback, 1)

        return X_train, X_val, X_test, y_train, y_val, y_test
    
    def build_models(self):
        """Build LSTM and XGBoost models."""
        # LSTM model
        input_layer = Input(shape=(self.lookback, 1))  # Define input layer
        x = LSTM(50, activation='relu', return_sequences=True)(input_layer)  # Connect input
        x = Dropout(0.2)(x)
        x = LSTM(50, activation='relu')(x)
        x = Dropout(0.2)(x)
        output_layer = Dense(1)(x)

        self.models['lstm'] = keras.Model(inputs=input_layer, outputs=output_layer)  # Create model
        self.models['lstm'].compile(optimizer='adam', loss='mse')

        # XGBoost model
        self.models['xgb'] = xgb.XGBRegressor(
            objective='reg:squarederror',
            n_estimators=100,
            learning_rate=0.1,
            max_depth=3
        )
    
    def train(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """Train both LSTM and XGBoost models."""
        # Split data
        print("Shape of X:", X.shape)  # Print shape of X before split
        print("Shape of y:", y.shape)  # Print shape of y before split

        X_train, X_val, X_test, y_train, y_val, y_test = self.split_data(X, y)
        
        # Build models if not already built
        if not self.models:
            self.build_models()
        
        # Train LSTM
        self.models['lstm'].fit(
            X_train, y_train,
            epochs=50,
            batch_size=32,
            validation_data=(X_val, y_val),
            verbose=0
        )
        
        # Prepare data for XGBoost
        X_train_2d = X_train.reshape(X_train.shape[0], -1)
        X_test_2d = X_test.reshape(X_test.shape[0], -1)
        
        # Train XGBoost
        self.models['xgb'].fit(X_train_2d, y_train)
        
        # Calculate metrics
        self._calculate_metrics(X_test, y_test)
        
        return X_test, y_test
    
    def _calculate_metrics(self, X_test: np.ndarray, y_test: np.ndarray):
        """Calculate performance metrics for both models."""
        from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
        
        # LSTM predictions
        lstm_preds = self.models['lstm'].predict(X_test, verbose=0)
        
        # XGBoost predictions
        X_test_2d = X_test.reshape(X_test.shape[0], -1)
        xgb_preds = self.models['xgb'].predict(X_test_2d)
        
        # Calculate metrics for both models
        for model_name, preds in [('lstm', lstm_preds), ('xgb', xgb_preds)]:
            self.metrics[model_name] = {
                'mse': mean_squared_error(y_test, preds),
                'mae': mean_absolute_error(y_test, preds),
                'r2': r2_score(y_test, preds)
            }
    
    def generate_forecasts(self, last_sequence: np.ndarray) -> pd.DataFrame:
        """Generate and format forecasts."""
        # Generate raw predictions
        predictions = self.predict(last_sequence)
        
        # Create forecast dates
        last_date = pd.Timestamp.now().date()
        forecast_dates = pd.date_range(start=last_date, periods=self.forecast_horizon + 1)[1:]
        
        # Create forecast DataFrame
        forecasts_df = pd.DataFrame({
            'date': forecast_dates,
            'predicted_sales': predictions,
            'confidence_lower': predictions * 0.9,  # Simple confidence interval
            'confidence_upper': predictions * 1.1
        })
        
        return forecasts_df
    
    def predict(self, last_sequence: np.ndarray) -> np.ndarray:
        """Generate ensemble forecast."""
        forecasts = []
        sequence = last_sequence.copy()
        
        for _ in range(self.forecast_horizon):
            # LSTM prediction
            lstm_pred = self.models['lstm'].predict(
                sequence.reshape(1, self.lookback, 1), verbose=0
            )[0, 0]
            
            # XGBoost prediction
            xgb_pred = self.models['xgb'].predict(sequence.reshape(1, -1))[0]
            
            # Ensemble prediction (average)
            pred = (lstm_pred + xgb_pred) / 2
            forecasts.append(pred)
            
            # Update sequence
            sequence = np.roll(sequence, -1)
            sequence[-1] = pred
        
        # Inverse transform predictions
        forecasts = np.array(forecasts).reshape(-1, 1)
        return self.scaler.inverse_transform(forecasts).flatten()
    
    def save_models(self, base_path: str = './models'):
        """Save models and scalers."""
        import os
        import pickle
        
        # Create directory if it doesn't exist
        os.makedirs(base_path, exist_ok=True)
        
        # Save LSTM model
        self.models['lstm'].save(os.path.join(base_path, 'lstm_model'))
        
        # Save XGBoost model
        with open(os.path.join(base_path, 'xgb_model.pkl'), 'wb') as f:
            pickle.dump(self.models['xgb'], f)
        
        # Save scaler
        with open(os.path.join(base_path, 'scaler.pkl'), 'wb') as f:
            pickle.dump(self.scaler, f)

def create_interactive_chat(pipeline, df):
    """Create an interactive chat interface using IPython widgets."""
    output = widgets.Output()
    
    text_input = widgets.Text(
        value='',
        placeholder='Ask a question about the sales data...',
        description='Query:',
        disabled=False,
        layout=widgets.Layout(width='80%')
    )
    
    send_button = widgets.Button(
        description='Ask',
        disabled=False,
        button_style='primary',
        tooltip='Send query',
        icon='send'
    )
    
    sample_questions = [
        'Select a sample question...',
        'What was our best performing day?',
        'Which product category generates the most revenue?',
        'What is the most common payment method?',
        'What type of customers shop the most?',
        'What is our average daily revenue?'
    ]
    
    question_dropdown = widgets.Dropdown(
        options=sample_questions,
        description='Examples:',
        disabled=False,
        layout=widgets.Layout(width='80%')
    )
    chatbot = SalesDataChatbot(pipeline.gemini)
    
    def on_button_click(b):
        with output:
            clear_output()
            query = text_input.value if text_input.value else None
            if query:
                print(f"Question: {query}")
                response = pipeline.chatbot.query_data(df, query)
                print(f"\nResponse: {response}")
                text_input.value = ''
    
    def on_dropdown_change(change):
        if change['new'] != sample_questions[0]:
            text_input.value = change['new']
            on_button_click(None)
            question_dropdown.value = sample_questions[0]
    
    send_button.on_click(on_button_click)
    question_dropdown.observe(on_dropdown_change, names='value')
    
    display(widgets.VBox([
        widgets.HBox([text_input, send_button]),
        question_dropdown,
        output
    ]))

def main():
    """Main function to demonstrate the enhanced forecasting system."""
    try:
        # Initialize system with API keys
        system = SalesInsightPipeline(
            gemini_api_key="YOUR_GEMINI_API_KEY"  # Replace with actual API key
        )
        
        # Load and process data
        df = pd.read_csv('/content/groc_sales.csv')
        # Convert 'timestamp' to datetime format (assuming 'timestamp' is in YYYY-MM-DD HH:MM format)
        df['datetime'] = pd.to_datetime(df['timestamp'], format='%d-%m-%Y %H:%M')

        # Extract components from datetime
        df['date'] = df['datetime'].dt.date
        df['day'] = df['datetime'].dt.day
        df['month'] = df['datetime'].dt.month
        df['year'] = df['datetime'].dt.year
        df['time'] = df['datetime'].dt.time
        df['hours'] = df['datetime'].dt.hour
        df['minutes'] = df['datetime'].dt.minute
        df['seconds'] = df['datetime'].dt.second

        # Drop the original timestamp column (optional)
        df.drop('timestamp', axis=1, inplace=True)  # Uncomment to drop original column

        
        # Initialize pipeline
        api_key = "YOUR_GEMINI_API_KEY"  # Replace with your actual API key
        pipeline = SalesInsightPipeline(gemini_api_key=api_key)
        
        print("🤖 Welcome to the Sales Analysis Chatbot!")
        print("----------------------------------------")
        print("You can ask questions about:")
        print("- Sales performance and trends")
        print("- Customer behavior")
        print("- Product categories")
        print("- Payment methods")
        print("- Daily, weekly, or monthly patterns")
        print("----------------------------------------")
        
        # Create interactive chat interface
        create_interactive_chat(pipeline, df)
        
        # Train ML models in the background
        print("\nTraining ML models for forecasting...")
        X, y = pipeline.prepare_data(df)
        if len(X) == 0 or len(y) == 0:
            raise ValueError("Not enough data to train the models.")
        X, y = pipeline.create_sequences(y)  # Ensure y is correctly sequenced
        pipeline.build_models()
        X_test, y_test = pipeline.train(X, y)
        print("ML models trained successfully!")

    except Exception as e:
        print(f"Error in main function: {str(e)}")

if __name__ == "__main__":
    main()