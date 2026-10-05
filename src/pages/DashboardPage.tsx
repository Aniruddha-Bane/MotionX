import React from 'react';
import { 
  Users, 
  Gauge, 
  AlertOctagon, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Bus,
  Train
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { TransitRoute, SimulationState } from '../types';
import { SEVEN_DAY_TREND, generate24HourProfile, calculateDemandLevel } from '../data/mumbaiTransitData';
import { DemandBadge } from '../components/common/DemandBadge';

interface DashboardPageProps {
  routes: TransitRoute[];
  simulation: SimulationState;
  onNavigateTab: (tab: string) => void;
  onDeployToRoute?: (routeId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  routes,
  simulation,
  onNavigateTab,
  onDeployToRoute
}) => {
  // Compute simulation-adjusted values
  const extraVehicles = simulation.dispatchedExtras['302'] || 0;
  const extraCapacity = extraVehicles * 250;
  
  // Calculate dynamic metrics
  const bottleneckCapacity = 1000 + extraCapacity;
  let bottleneckPredicted = 1420;
  if (simulation.weather === 'rain') bottleneckPredicted = Math.round(bottleneckPredicted * 1.08);
  if (simulation.weather === 'heavy_rain') bottleneckPredicted = Math.round(bottleneckPredicted * 1.18);
  if (simulation.hasSpecialEvent) bottleneckPredicted = Math.round(bottleneckPredicted * 1.25);
  
  const bottleneckOccupancy = Number(((bottleneckPredicted / bottleneckCapacity) * 100).toFixed(1));

  // Compute 24-hr hourly profile for Route 302
  const hourlyData = React.useMemo(() => {
    return generate24HourProfile('302', simulation.weather, simulation.hasSpecialEvent);
  }, [simulation.weather, simulation.hasSpecialEvent]);

  // Route utilization data
  const routeUtilization = routes.map((r) => {
    const extra = (simulation.dispatchedExtras[r.id] || 0) * (r.mode === 'BUS' ? 70 : 250);
    const effCap = r.capacity + extra;
    let pred = r.predictedDemand;
    if (simulation.weather === 'rain') pred = Math.round(pred * 1.08);
    if (simulation.weather === 'heavy_rain') pred = Math.round(pred * 1.18);
    if (simulation.hasSpecialEvent) pred = Math.round(pred * 1.22);
    const occ = Number(((pred / effCap) * 100).toFixed(1));
    return {
      id: r.id,
      name: r.name.split('—')[1]?.trim() || r.name,
      mode: r.mode,
      demand: pred,
      capacity: effCap,
      occupancy: occ,
      status: calculateDemandLevel(occ)
    };
  }).sort((a, b) => b.occupancy - a.occupancy);

  const overCapacityCount = routeUtilization.filter(r => r.occupancy > 100).length;
  const avgOccupancy = Number(
    (routeUtilization.reduce((acc, curr) => acc + curr.occupancy, 0) / routeUtilization.length).toFixed(1)
  );

  // Mode Split data
  const modeData = [
    { name: 'Suburban Train', value: 58, color: '#38bdf8' },
    { name: 'City Feeder Bus', value: 42, color: '#818cf8' }
  ];

  // Occupancy category distribution
  const occupancyDist = [
    { name: 'Low (<60%)', count: routeUtilization.filter(r => r.occupancy < 60).length, color: '#10b981' },
    { name: 'Moderate (60-80%)', count: routeUtilization.filter(r => r.occupancy >= 60 && r.occupancy < 80).length, color: '#38bdf8' },
    { name: 'High (80-100%)', count: routeUtilization.filter(r => r.occupancy >= 80 && r.occupancy <= 100).length, color: '#f59e0b' },
    { name: 'Over Capacity (>100%)', count: overCapacityCount, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            MotionX · Public Transport Intelligence
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Predict demand. <span className="text-cyan-400">Reduce overcrowding.</span> Move people smarter.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
            An intelligent analytics platform that transforms ridership data into demand forecasts, 
            overcrowding insights, and explainable service-allocation recommendations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('unified')}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-400/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Unified 3-in-1 Predictor
            </button>
            <button
              onClick={() => onNavigateTab('forecast')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2"
            >
              Explore Forecast
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('recommendations')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              View Recommendations
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Primary KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Daily Riders
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              1.24M
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
              +8.4%
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Across 8 key Mumbai transit corridors
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Avg Fleet Occupancy
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {avgOccupancy}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Target: 75%
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Network capacity utilization
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Over Capacity Routes
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${overCapacityCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overCapacityCount} routes
            </span>
            <span className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded font-mono">
              &gt;100% Load
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Requires supplemental vehicle dispatch
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Peak Demand Window
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              8:30 AM
            </span>
            <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
              Rush Hour
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Secondary evening peak at 6:45 PM
          </p>
        </div>

      </section>

      {/* System Insight & Actions Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TODAY'S BIGGEST BOTTLENECK CARD */}
        <div className="lg:col-span-1 rounded-2xl border-2 border-rose-500/40 bg-gradient-to-b from-rose-950/30 to-slate-900/80 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg font-mono">
            CRITICAL BOTTLENECK
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Today's Biggest Bottleneck
              </h2>
            </div>

            <div>
              <div className="text-2xl font-black text-white">ROUTE 302</div>
              <div className="text-sm font-medium text-slate-300">Dadar → Mulund (Central Line)</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80">
              <div>
                <div className="text-[11px] text-slate-400">Predicted Peak</div>
                <div className="text-lg font-bold text-white font-mono tabular-nums">
                  {bottleneckPredicted.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Capacity</div>
                <div className="text-lg font-bold text-slate-300 font-mono tabular-nums">
                  {bottleneckCapacity.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Occupancy</div>
                <div className={`text-lg font-black font-mono tabular-nums ${bottleneckOccupancy > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {bottleneckOccupancy}%
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Actionable Recommendation:
              </div>
              <div className="text-xs text-slate-300">
                {extraVehicles > 0
                  ? `Successfully injected +${extraVehicles} extra train(s). Occupancy lowered to ${bottleneckOccupancy}%.`
                  : 'Deploy 2 additional suburban trains or express feeder buses between 08:00–09:30 AM.'}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            {extraVehicles === 0 ? (
              <button
                onClick={() => onDeployToRoute && onDeployToRoute('302')}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 transition-colors flex items-center justify-center gap-2"
              >
                Dispatch +2 Standby Units Now
              </button>
            ) : (
              <div className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 text-center">
                ✓ Mitigation Active (+{extraVehicles} Units)
              </div>
            )}
          </div>
        </div>

        {/* TOP 3 ACTIONS FOR TODAY */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Top 3 Actions for Today
              </h2>
              <p className="text-xs text-slate-400">
                Generated deterministically by MotionX recommendation engine
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('recommendations')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              All Recommendations <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                num: '01',
                title: 'Increase Route 302 peak frequency',
                desc: 'Deploy +2 peak rakes between 08:00–09:30 AM to absorb 1,420 commuter surge.',
                impact: 'Reduces overcrowding by ~29.5%',
                badge: 'CRITICAL',
                routeId: '302'
              },
              {
                num: '02',
                title: 'Add peak-hour service on Route 421',
                desc: 'Shorten Thane → Ghatkopar headway from 8 min to 5 min from 08:30–10:00 AM.',
                impact: 'Brings occupancy down from 110% to 92.4%',
                badge: 'HIGH',
                routeId: '421'
              },
              {
                num: '03',
                title: 'Reduce low-demand Route 505 service after 10 PM',
                desc: 'Extend headway on Navi Mumbai → Kurla from 15m to 30m during 23.3% occupancy window.',
                impact: 'Conserves 240 km empty running & reallocates drivers',
                badge: 'LOW',
                routeId: '505'
              }
            ].map((action) => (
              <div
                key={action.num}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-colors flex items-start gap-3"
              >
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 w-7 h-7 rounded flex items-center justify-center shrink-0">
                  {action.num}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{action.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      action.badge === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      action.badge === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{action.desc}</p>
                  <div className="text-[11px] font-mono text-cyan-300/90 pt-0.5">
                    → Expected Impact: {action.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500 pt-1">
            *All recommendations are explainable and derived from capacity limits vs RandomForest demand models.
          </div>
        </div>

      </section>

      {/* Main Analytics Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 7-Day Ridership Trend */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Ridership Trend (Last 7 Days)
              </h2>
              <p className="text-xs text-slate-400">Actual daily system volume vs baseline capacity</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>7-Day MA</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEVEN_DAY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayName" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  formatter={(val: any) => [typeof val === 'number' ? `${(val / 1000000).toFixed(2)}M Riders` : String(val), 'Ridership']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line 
                  type="monotone" 
                  dataKey="ridership" 
                  name="Actual Ridership" 
                  stroke="#38bdf8" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#38bdf8' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="capacity" 
                  name="System Capacity" 
                  stroke="#475569" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 24-Hour Demand Curve */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Hourly Demand Profile (Route 302)
              </h2>
              <p className="text-xs text-slate-400">24-hour demand cycle with morning & evening peaks</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-300 font-mono">08:00 Peak</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} interval={3} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="predictedDemand" 
                  name="Predicted Demand" 
                  stroke="#22d3ee" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#cyanDemand)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="capacity" 
                  name="Capacity" 
                  stroke="#ef4444" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3" 
                  dot={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Secondary Metrics: Route Utilization & Modal Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route Utilization Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Route Capacity Utilization Ranking
              </h2>
              <p className="text-xs text-slate-400">Peak hour passenger load vs allocated capacity</p>
            </div>
            <button
              onClick={() => onNavigateTab('routes')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Analyze All Routes →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={routeUtilization}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 160]} stroke="#64748b" unit="%" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#cbd5e1" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [typeof val === 'number' ? `${val}% Occupancy` : String(val), 'Load']}
                />
                <Bar dataKey="occupancy" radius={[0, 4, 4, 0]}>
                  {routeUtilization.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.occupancy > 100 ? '#f43f5e' : entry.occupancy >= 80 ? '#f59e0b' : '#38bdf8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modal Split & Occupancy Distribution */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Transport Mode Split
            </h2>
            <p className="text-xs text-slate-400">Ridership volume by transit mode</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`mode-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-sky-400" /> Suburban Rail
              </span>
              <span className="font-mono text-white font-bold">58% · 720k daily</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-indigo-400" /> Feeder Bus
              </span>
              <span className="font-mono text-white font-bold">42% · 520k daily</span>
            </div>
          </div>
        </div>

      </section>

      {/* Top Ranked High-Demand Routes Table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Mumbai Transit Corridor Overview
            </h2>
            <p className="text-xs text-slate-400">
              Ranked by predicted rush hour passenger occupancy
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Capacity Model: Static Fleet + Dispatched Units</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Route & Corridor</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-3 text-right">Predicted Demand</th>
                <th className="py-3 px-3 text-right">Capacity</th>
                <th className="py-3 px-3 text-right">Occupancy</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {routeUtilization.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{r.id}</div>
                    <div className="text-xs text-slate-400">{r.name}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-300 font-mono">{r.mode}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-white tabular-nums">
                    {r.demand.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                    {r.capacity.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                    <span className={r.occupancy > 100 ? 'text-rose-400' : r.occupancy >= 80 ? 'text-amber-400' : 'text-emerald-400'}>
                      {r.occupancy}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <DemandBadge level={r.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('forecast')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Forecast →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
