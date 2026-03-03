
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
    { id: 'arima', name: 'ARIMA', desc: 'Modelo estatístico autorregressivo para séries temporais.', tech: 'Baseado em Estatística' },
    { id: 'prophet', name: 'Prophet', desc: 'Decompõe tendência, sazonalidade e feriados.', tech: 'Decomposição' },
    { id: 'rf', name: 'Random Forest', desc: 'Aprendizado de conjunto para regressão multivariada.', tech: 'Machine Learning' },
    { id: 'lstm', name: 'LSTM', desc: 'Deep Learning otimizado para sequências de longo prazo.', tech: 'Redes Neurais' }
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
            {data.isForecast ? 'Previsão: ' : 'Real: '}
            <span style={{ fontWeight: 700 }}>{data.value.toFixed(1)}</span>
          </p>
          {data.isForecast && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Intervalo: {data.confidenceLow.toFixed(1)} - {data.confidenceHigh.toFixed(1)}
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
            <h1>Sistema de Previsão Aegis</h1>
            <p>Plataforma de inteligência para otimização de recursos e planejamento</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn glass-panel" style={{ color: 'var(--text-secondary)' }}>
              <Download size={18} /> Exportar Relatório
            </button>
            <button className="btn btn-primary" onClick={runForecast}>
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Iniciar Análise
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-label">Demanda Média Atual</span>
            <div className="stat-value">{(history.reduce((a, b) => a + b.value, 0) / history.length).toFixed(1)}</div>
            <div className="stat-trend trend-up"><TrendingUp size={14} /> +4.2% Crescimento</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">Confiança do Sistema</span>
            <div className="stat-value">{metrics.MAPE ? (100 - parseFloat(metrics.MAPE)).toFixed(1) : '94.2'}%</div>
            <div className="stat-trend" style={{ color: 'var(--text-secondary)' }}>Meta: >90%</div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">Erro MAE / RMSE</span>
            <div className="stat-value">{metrics.MAE || '--'} / {metrics.RMSE || '--'}</div>
            <div className="stat-trend" style={{ color: metrics.MAE < 10 ? 'var(--success)' : 'var(--warning)' }}>
              {metrics.MAE < 10 ? 'Alta Precisão' : 'Necessita Treino'}
            </div>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-label">Próximo Pico Esperado</span>
            <div className="stat-value">14 Fev</div>
            <div className="stat-trend" style={{ color: 'var(--warning)' }}><AlertCircle size={14} /> Impacto de Evento</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="glass-panel main-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Horizonte de Previsão</h2>
            <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '1rem', border: 'none', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--secondary)' }}></span> Real
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--primary)' }}></span> Previsto
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
                <ReferenceLine x={history[history.length - 1].date} stroke="var(--text-secondary)" strokeDasharray="3 3" label={{ value: 'Início da Previsão', position: 'top', fill: 'var(--text-secondary)', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Model Selection */}
        <div className="side-panel">
          <div className="glass-panel model-selector" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Brain className="text-primary" size={24} />
              <h3 style={{ fontWeight: 600 }}>Motor Preditivo</h3>
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
              <h3 style={{ fontWeight: 600 }}>Avaliação de Resultados</h3>
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
                <span style={{ color: 'var(--text-secondary)' }}>Eficiência:</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>Otimizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Planning / Simulation */}
        <div className="glass-panel simulator-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Settings2 size={24} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Simulador de Cenário Operacional</h2>
            <Info size={16} style={{ color: 'var(--text-secondary)', cursor: 'help' }} />
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '800px' }}>
            Ajuste variáveis externas para simular o impacto na demanda futura. Use estas simulações para testar sua cadeia de suprimentos e capacidade operacional.
          </p>

          <div className="slider-group">
            <div className="slider-item">
              <label>
                Offset de Temperatura <span>{simParams.weather > 0 ? '+' : ''}{simParams.weather}°C</span>
              </label>
              <input
                type="range" min="-10" max="10" step="1"
                value={simParams.weather}
                onChange={(e) => setSimParams({ ...simParams, weather: parseInt(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Mais Frio</span>
                <span>Onda de Calor</span>
              </div>
            </div>

            <div className="slider-item">
              <label>
                Frequência de Eventos <span>{simParams.events} Eventos Críticos</span>
              </label>
              <input
                type="range" min="0" max="5" step="1"
                value={simParams.events}
                onChange={(e) => setSimParams({ ...simParams, events: parseInt(e.target.value) })}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Padrão</span>
                <span>Alta Temporada</span>
              </div>
            </div>

            <div className="slider-item">
              <label>
                Horizonte de Previsão <span>{horizon} Dias</span>
              </label>
              <input
                type="range" min="7" max="90" step="7"
                value={horizon}
                onChange={(e) => setHorizon(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>Curto Prazo</span>
                <span>Estratégico</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recomendação Estratégica</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {simParams.events > 2 ?
                "⚠️ Alta probabilidade de picos de demanda devido a eventos agendados. Recomenda-se aumentar o stock em 15% e otimizar turnos de pessoal." :
                simParams.weather > 5 ?
                  "☀️ Onda de calor detetada na simulação. Antecipe um aumento de 20% no consumo de recursos. Verifique sistemas de refrigeração." :
                  "✅ Operações atuais alinhadas com a previsão de 30 dias. Manter ciclo padrão de aquisição sem risco imediato de rutura."
              }
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
