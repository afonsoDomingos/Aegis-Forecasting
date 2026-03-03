
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, ReferenceLine
} from 'recharts';
import {
  Brain, TrendingUp, Cloud, Calendar, Download, RefreshCw, BarChart3, Settings2, Info, AlertCircle
} from 'lucide-react';
import { ForecastingEngine } from './models/ForecastingEngine';
import historyRaw from './data/historyData.json';
import './index.css';

const App = () => {
  const [history, setHistory] = useState(historyRaw);
  const [selectedModel, setSelectedModel] = useState('arima');
  const [forecast, setForecast] = useState([]);
  const [horizon, setHorizon] = useState(30);
  const [metrics, setMetrics] = useState({});
  const [simParams, setSimParams] = useState({ weather: 0, events: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Models List
  const models = [
    { id: 'arima', name: 'ARIMA', desc: 'AutoRegressive statistical model for time series.', tech: 'Stats-based' },
    { id: 'prophet', name: 'Prophet', desc: 'Decomposes trend, seasonality, and holidays.', tech: 'Decomposition' },
    { id: 'rf', name: 'Random Forest', desc: 'Ensemble learning for multi-variate regression.', tech: 'Machine Learning' },
    { id: 'lstm', name: 'LSTM', desc: 'Deep Learning optimized for long-term sequences.', tech: 'Neural Networks' }
  ];

  // Run Forecast
  const runForecast = () => {
    setIsLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      const result = ForecastingEngine.generateForecast(history, selectedModel, simParams, horizon);
      setForecast(result);

      // Calculate mock metrics (in real app, we'd use a test set)
      const mockMetrics = ForecastingEngine.calculateMetrics(history.slice(-10), result.slice(0, 10));
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    runForecast();
  }, [selectedModel, horizon, simParams]);

  const chartData = useMemo(() => {
    return [...history, ...forecast];
  }, [history, forecast]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel" style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{data.date}</p>
          <p style={{ fontSize: '1.2rem', color: data.isForecast ? 'var(--primary)' : 'var(--secondary)' }}>
            {data.isForecast ? 'Forecast: ' : 'Actual: '}
            <span style={{ fontWeight: 700 }}>{data.value.toFixed(1)}</span>
          </p>
          {data.isForecast && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Range: {data.confidenceLow.toFixed(1)} - {data.confidenceHigh.toFixed(1)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-container">

        {/* Header */}
        <header className="header">
          <div className="title-group">
            <h1>Aegis Forecasting System</h1>
            <p>Intelligence platform for resource optimization & planning</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn glass-panel" style={{ color: 'var(--text-secondary)' }}>
              <Download size={18} /> Export Report
            </button>
            <button className="btn btn-primary" onClick={runForecast}>
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Run Analysis
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-label">Current Avg Demand</span>
            <div className="stat-value">{(history.reduce((a, b) => a + b.value, 0) / history.length).toFixed(1)}</div>
            <div className="stat-trend trend-up"><TrendingUp size={14} /> +4.2% Growth</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">System Confidence</span>
            <div className="stat-value">{metrics.MAPE ? (100 - parseFloat(metrics.MAPE)).toFixed(1) : '94.2'}%</div>
            <div className="stat-trend" style={{ color: 'var(--text-secondary)' }}>Target: >90%</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">MAE / RMSE</span>
            <div className="stat-value">{metrics.MAE || '--'} / {metrics.RMSE || '--'}</div>
            <div className="stat-trend" style={{ color: metrics.MAE < 10 ? 'var(--success)' : 'var(--warning)' }}>
              {metrics.MAE < 10 ? 'High Accuracy' : 'Learning Needed'}
            </div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">Next Peak Expected</span>
            <div className="stat-value">Feb 14</div>
            <div className="stat-trend" style={{ color: 'var(--warning)' }}><AlertCircle size={14} /> Event Impact</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="glass-panel main-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Forecasting Horizon</h2>
            <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '1rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--secondary)' }}></span> Actual
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--primary)' }}></span> Predict
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval={5}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Confidence Interval Area */}
                <Area
                  dataKey="confidenceHigh"
                  data={forecast}
                  stroke="none"
                  fill="var(--primary)"
                  fillOpacity={0.1}
                  activeDot={false}
                />
                <Area
                  dataKey="confidenceLow"
                  data={forecast}
                  stroke="none"
                  fill="var(--bg-deep)"
                  fillOpacity={1}
                  activeDot={false}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--secondary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--secondary)', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  data={history}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  data={forecast}
                />
                <ReferenceLine x={history[history.length - 1].date} stroke="var(--text-secondary)" strokeDasharray="3 3" label={{ value: 'Start Forecast', position: 'top', fill: 'var(--text-secondary)', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Model Selection */}
        <div className="side-panel">
          <div className="glass-panel model-selector" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Brain className="text-primary" size={24} />
              <h3 style={{ fontWeight: 600 }}>Predictive Engine</h3>
            </div>

            {models.map(model => (
              <div
                key={model.id}
                className={`model-option ${selectedModel === model.id ? 'active' : ''}`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{model.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>{model.tech}</span>
                </div>
                <p>{model.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <BarChart3 size={20} />
              <h3 style={{ fontWeight: 600 }}>Evaluation Results</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>MAPE:</span>
                <span style={{ fontWeight: 600 }}>{metrics.MAPE || '5.8%'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>RMSE:</span>
                <span style={{ fontWeight: 600 }}>{metrics.RMSE || '12.4'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Efficiency:</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Planning / Simulation */}
        <div className="glass-panel simulator-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Settings2 size={24} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Operational Scenario Simulator</h2>
            <Info size={16} style={{ color: 'var(--text-secondary)', cursor: 'help' }} />
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '800px' }}>
            Adjust external variables to simulate their impact on future demand. Use these simulations to stress-test your supply chain and operational capacity.
          </p>

          <div className="slider-group">
            <div className="slider-item">
              <label>
                Temperature Offset <span>{simParams.weather > 0 ? '+' : ''}{simParams.weather}°C</span>
              </label>
              <input
                type="range" min="-10" max="10" step="1"
                value={simParams.weather}
                onChange={(e) => setSimParams({ ...simParams, weather: parseInt(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Cooler</span>
                <span>Heatwave</span>
              </div>
            </div>

            <div className="slider-item">
              <label>
                Event Frequency <span>{simParams.events} Critical Events</span>
              </label>
              <input
                type="range" min="0" max="5" step="1"
                value={simParams.events}
                onChange={(e) => setSimParams({ ...simParams, events: parseInt(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Standard</span>
                <span>Peak Season</span>
              </div>
            </div>

            <div className="slider-item">
              <label>
                Forecast Horizon <span>{horizon} Days</span>
              </label>
              <input
                type="range" min="7" max="90" step="7"
                value={horizon}
                onChange={(e) => setHorizon(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Short Term</span>
                <span>Strategic</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Strategic Recommendation</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {simParams.events > 2 ?
                "⚠️ High probability of demand spikes due to scheduled events. Recommend increasing inventory by 15% and optimizing staff shifts for peak hours." :
                simParams.weather > 5 ?
                  "☀️ Heatwave detected in simulation. Anticipate a 20% increase in resource consumption. Ensure cooling systems are at 100% capacity." :
                  "✅ Current operations are aligned with 30-day forecast. Maintain standard procurement cycle with no immediate risk of stockout."
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
