import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Sliders, 
  Zap, 
  Layers, 
  BrainCircuit, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { TransitRoute, SimulationState, WeatherCondition } from '../types';
import { transitService, PredictResponse } from '../services/api';
import { DemandBadge } from '../components/common/DemandBadge';
import { generate24HourProfile } from '../data/mumbaiTransitData';

interface ForecastPageProps {
  routes: TransitRoute[];
  simulation: SimulationState;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ routes, simulation }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('302');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'TRAIN' | 'BUS'>('ALL');
  const [horizon, setHorizon] = useState<'6H' | '12H' | '24H'>('24H');
  const [customHour, setCustomHour] = useState<number>(8);
  const [customWeather, setCustomWeather] = useState<WeatherCondition>(simulation.weather);
  const [customEvent, setCustomEvent] = useState<boolean>(simulation.hasSpecialEvent);
  const [prevDemand, setPrevDemand] = useState<number>(1050);

  const [predictionResult, setPredictionResult] = useState<PredictResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const filteredRoutes = routes.filter(r => {
    if (modeFilter === 'ALL') return true;
    return r.mode === modeFilter;
  });

  // Calculate 24-hr chart data
  const fullChartData = React.useMemo(() => {
    return generate24HourProfile(selectedRouteId, customWeather, customEvent);
  }, [selectedRouteId, customWeather, customEvent]);

  // Horizon slice
  const displayedChartData = React.useMemo(() => {
    if (horizon === '6H') return fullChartData.slice(6, 13);
    if (horizon === '12H') return fullChartData.slice(6, 19);
    return fullChartData;
  }, [fullChartData, horizon]);

  // Run ML model inference
  const handleRunInference = async () => {
    setIsPredicting(true);
    try {
      const res = await transitService.predictDemand({
        route_id: selectedRouteId,
        hour: customHour,
        day_of_week: 1,
        is_weekend: simulation.isWeekend,
        is_holiday: false,
        weather_condition: customWeather,
        temperature: 28.5,
        historical_ridership: selectedRoute.capacity * 0.9,
        previous_hour_ridership: prevDemand,
        special_event: customEvent
      });
      setPredictionResult(res);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    handleRunInference();
  }, [selectedRouteId, customHour, customWeather, customEvent, prevDemand, simulation.isWeekend]);

  // Find Peak Demand Window
  const peakHourPoint = [...fullChartData].sort((a, b) => b.predictedDemand - a.predictedDemand)[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Title & Controls Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <TrendingUp className="w-3.5 h-3.5" />
            Machine Learning Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Ridership Demand Forecast
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Predict upcoming transit demand and compare forecasted loads against rated vehicle capacity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Route Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400">Route:</span>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {filteredRoutes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.id} — {r.name.split('—')[1]?.trim() || r.name} ({r.mode})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['ALL', 'TRAIN', 'BUS'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  modeFilter === m ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['6H', '12H', '24H'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  horizon === h ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main KPI Forecast Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Predicted Demand (Hour {customHour}:00)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-cyan-300 font-mono tabular-nums">
              {predictionResult ? predictionResult.predicted_ridership.toLocaleString() : '...'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CI: [{predictionResult?.confidence_interval[0]} - {predictionResult?.confidence_interval[1]}]
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Based on Random Forest regression model
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Expected Occupancy
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${
              (predictionResult?.occupancy_percentage || 0) > 100 ? 'text-rose-400' : 'text-white'
            }`}>
              {predictionResult?.occupancy_percentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Cap: {selectedRoute.capacity}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {predictionResult && predictionResult.occupancy_percentage > 100
              ? `Deficit of ${predictionResult.predicted_ridership - selectedRoute.capacity} seats`
              : 'Within safe physical capacity'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Demand Classification
          </span>
          <div className="pt-1">
            {predictionResult && (
              <DemandBadge level={predictionResult.demand_level} occupancy={predictionResult.occupancy_percentage} />
            )}
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Threshold: &gt;100% triggers emergency dispatch
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Model Validation Accuracy
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              0.914
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              R² Score
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            MAE: 46.8 pax · RMSE: 64.2 pax
          </p>
        </div>

      </section>

      {/* Main Forecast Chart: Historical Demand vs Predicted Demand */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Historical Demand vs. ML Predicted Demand</span>
              <span className="text-xs font-normal text-slate-400 font-mono">({selectedRoute.name})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Solid line represents recorded baseline demand. Dashed line denotes future model forecast.
            </p>
          </div>

          {/* Peak Window Highlight Card */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">PEAK DEMAND WINDOW</div>
              <div className="text-xs font-bold text-white font-mono">
                {peakHourPoint ? `${peakHourPoint.label} – ${(peakHourPoint.hour + 1).toString().padStart(2, '0')}:30` : '08:00 – 09:30'} 
                <span className="text-amber-400 ml-1">({peakHourPoint?.predictedDemand.toLocaleString()} pax)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayedChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="actualDemand"
                name="Historical Demand (Actual)"
                stroke="#64748b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#64748b' }}
              />
              <Line
                type="monotone"
                dataKey="predictedDemand"
                name="ML Predicted Demand"
                stroke="#22d3ee"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: '#22d3ee' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                name="Fleet Capacity Limit"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Solid: Historical baseline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-cyan-400 inline-block" /> Dashed: ML Prediction
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" /> Red: Vehicle Capacity Ceiling
            </span>
          </div>
          <span className="font-mono text-cyan-400">Trained on 25,200 Observations</span>
        </div>
      </section>

      {/* Interactive ML Inference Sandbox */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              Interactive ML Predictor Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              Test what-if scenarios directly against the Random Forest regressor weights
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
            POST /api/predict READY
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Hour</label>
            <input
              type="number"
              min="0"
              max="23"
              value={customHour}
              onChange={(e) => setCustomHour(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">0 to 23 hours (e.g. 8 for morning peak)</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Previous Hour Ridership</label>
            <input
              type="number"
              min="0"
              max="2500"
              value={prevDemand}
              onChange={(e) => setPrevDemand(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
            <span className="text-[10px] text-slate-500">Autoregressive lag feature</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Weather Condition</label>
            <select
              value={customWeather}
              onChange={(e) => setCustomWeather(e.target.value as WeatherCondition)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="clear">Clear (Normal)</option>
              <option value="rain">Moderate Rain (+8%)</option>
              <option value="heavy_rain">Heavy Monsoon (+18%)</option>
            </select>
            <span className="text-[10px] text-slate-500">Road slowdown alters modal shift</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Special Event</label>
            <select
              value={customEvent ? 'true' : 'false'}
              onChange={(e) => setCustomEvent(e.target.value === 'true')}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="false">Standard Schedule</option>
              <option value="true">Stadium Match / BKC Expo (+25%)</option>
            </select>
            <span className="text-[10px] text-slate-500">High-volume venue spike</span>
          </div>

        </div>

        {/* Feature Contribution Breakdown */}
        {predictionResult && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Model Feature Attribution (Explainable Breakdown)</span>
              <span className="font-mono text-cyan-300">Total: {predictionResult.predicted_ridership} Pax</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Base Capacity</div>
                <div className="font-mono font-bold text-white mt-1">+{predictionResult.contributions.baseRate}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Hour Rush Factor</div>
                <div className={`font-mono font-bold mt-1 ${predictionResult.contributions.hourRushEffect >= 0 ? 'text-amber-400' : 'text-sky-400'}`}>
                  {predictionResult.contributions.hourRushEffect >= 0 ? `+${predictionResult.contributions.hourRushEffect}` : predictionResult.contributions.hourRushEffect}
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Weather Penalty</div>
                <div className="font-mono font-bold text-cyan-300 mt-1">+{predictionResult.contributions.weatherPenalty}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Event Surge</div>
                <div className="font-mono font-bold text-purple-300 mt-1">+{predictionResult.contributions.eventSurge}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Previous Hour Lag</div>
                <div className="font-mono font-bold text-slate-300 mt-1">
                  {predictionResult.contributions.previousHourLag >= 0 ? `+${predictionResult.contributions.previousHourLag}` : predictionResult.contributions.previousHourLag}
                </div>
              </div>
            </div>

            {predictionResult.recommendation && (
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <span><strong>Recommendation Engine Output:</strong> {predictionResult.recommendation}</span>
              </div>
            )}
          </div>
        )}

      </section>

    </div>
  );
};
