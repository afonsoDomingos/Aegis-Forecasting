
/**
 * Forecasting Engine for Aegis Forecast
 * Provides mathematical models for resource prediction.
 */

export class ForecastingEngine {
  /**
   * Generates a forecast based on selected model
   * @param {Array} history - Array of { date, value, externalVar }
   * @param {String} modelType - 'arima', 'prophet', 'rf', 'lstm'
   * @param {Object} parameters - Parameters like seasonality, trend
   * @param {Number} horizon - Days to predict
   */
  static generateForecast(history, modelType, parameters = {}, horizon = 30) {
    const lastPoint = history[history.length - 1];
    const avgValue = history.reduce((acc, curr) => acc + curr.value, 0) / history.length;
    
    // Detect seasonality (simple monthly pattern)
    const seasonality = this.detectSeasonality(history);
    
    const forecast = [];
    let lastValue = lastPoint.value;

    for (let i = 1; i <= horizon; i++) {
        const date = new Date(lastPoint.date);
        date.setDate(date.getDate() + i);
        
        let predictedValue;
        let uncertainty;

        switch(modelType) {
            case 'arima': // AutoRegressive Integrated Moving Average
                // Simplified AR(1) model: Y_t = c + phi * Y_{t-1} + e_t
                const drift = 0.05 * (avgValue / 100);
                predictedValue = lastValue + drift + (Math.random() - 0.5) * (avgValue * 0.05);
                uncertainty = i * 0.5;
                break;
                
            case 'prophet': // Additive Model (Trend + Seasonality + Holidays)
                const trend = (avgValue * 0.001) * i;
                const seasonalEffect = seasonality[date.getMonth()] || 0;
                predictedValue = avgValue + trend + (seasonalEffect * avgValue * 0.1) + (Math.random() - 0.5) * 2;
                uncertainty = i * 0.3;
                break;
                
            case 'rf': // Random Forest (Regression)
                // Random Forest captures complex relationships. 
                // We simulate it by weighting external variables.
                const extFactor = (parameters.weather || 0) * 0.5 + (parameters.events || 0) * 2;
                predictedValue = avgValue + extFactor + (Math.random() - 0.5) * 5;
                uncertainty = i * 0.6;
                break;
                
            case 'lstm': // Long Short-Term Memory (Deep Learning)
                // LSTM's strength is long-term dependencies.
                // We simulate it with a smoothed nonlinear trend.
                const wave = Math.sin(i / 7) * (avgValue * 0.08);
                predictedValue = lastValue * (1 + (Math.random() - 0.5) * 0.02) + wave;
                uncertainty = i * 0.8;
                break;

            default:
                predictedValue = avgValue;
                uncertainty = 5;
        }

        forecast.push({
            date: date.toISOString().split('T')[0],
            value: Math.max(0, predictedValue),
            confidenceLow: Math.max(0, predictedValue - uncertainty),
            confidenceHigh: predictedValue + uncertainty,
            isForecast: true
        });
        
        lastValue = predictedValue;
    }

    return forecast;
  }

  static detectSeasonality(history) {
    // Basic seasonality detection: Avg per month
    const months = {};
    history.forEach(p => {
        const m = new Date(p.date).getMonth();
        if(!months[m]) months[m] = [];
        months[m].push(p.value);
    });
    
    const seasonality = {};
    Object.keys(months).forEach(m => {
        const avg = months[m].reduce((a,b)=>a+b, 0) / months[m].length;
        seasonality[m] = avg;
    });
    
    return seasonality;
  }

  static calculateMetrics(actual, predicted) {
    let mae = 0;
    let mse = 0;
    let mape = 0;
    const n = Math.min(actual.length, predicted.length);

    for (let i = 0; i < n; i++) {
        const diff = Math.abs(actual[i].value - predicted[i].value);
        mae += diff;
        mse += diff * diff;
        mape += (diff / actual[i].value);
    }

    return {
        MAE: (mae / n).toFixed(2),
        RMSE: Math.sqrt(mse / n).toFixed(2),
        MAPE: ((mape / n) * 100).toFixed(2) + '%'
    };
  }
}
