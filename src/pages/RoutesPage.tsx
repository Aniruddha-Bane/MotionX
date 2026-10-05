import React, { useState } from 'react';
import { 
  GitCommit, 
  TrendingUp, 
  MapPin, 
  Users, 
  Gauge, 
  Clock, 
  Calendar, 
  ArrowRight,
  Train,
  Bus,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { TransitRoute, SimulationState } from '../types';
import { DemandBadge } from '../components/common/DemandBadge';
import { generate24HourProfile } from '../data/mumbaiTransitData';

interface RoutesPageProps {
  routes: TransitRoute[];
  simulation: SimulationState;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({ routes, simulation }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('302');

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Adjust for simulation
  const extra = (simulation.dispatchedExtras[selectedRoute.id] || 0) * (selectedRoute.mode === 'BUS' ? 70 : 250);
  const effectiveCapacity = selectedRoute.capacity + extra;
  
  let dynamicPredicted = selectedRoute.predictedDemand;
  if (simulation.weather === 'rain') dynamicPredicted = Math.round(dynamicPredicted * 1.08);
  if (simulation.weather === 'heavy_rain') dynamicPredicted = Math.round(dynamicPredicted * 1.18);
  if (simulation.hasSpecialEvent) dynamicPredicted = Math.round(dynamicPredicted * 1.25);
  
  const dynamicOccupancy = Number(((dynamicPredicted / effectiveCapacity) * 100).toFixed(1));

  const hourlyProfile = React.useMemo(() => {
    return generate24HourProfile(selectedRouteId, simulation.weather, simulation.hasSpecialEvent);
  }, [selectedRouteId, simulation.weather, simulation.hasSpecialEvent]);

  // Station loads
  const stopLoads = selectedRoute.stops.map((stop) => {
    const factor = dynamicPredicted / selectedRoute.predictedDemand;
    const stopPred = Math.round(stop.predictedDemand * factor);
    const stopOcc = Number(((stopPred / effectiveCapacity) * 100).toFixed(1));
    return {
      name: stop.name,
      sequence: stop.sequence,
      demand: stopPred,
      capacity: effectiveCapacity,
      occupancy: stopOcc,
      status: stopOcc > 100 ? 'CRITICAL' : stopOcc >= 80 ? 'HIGH' : stopOcc >= 60 ? 'MODERATE' : 'LOW'
    };
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header and Route Selector */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <GitCommit className="w-3.5 h-3.5" />
            Corridor Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Route Analysis & Capacity Diagnostics
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Drill into line-level operations, station progression, and overcrowding risk points.
          </p>
        </div>

        {/* Route Selector Dropdown & Quick Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Selected Route:</span>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  Route {r.id} — {r.name.split('—')[1]?.trim() || r.name} ({r.mode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Route Quick Selector Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {routes.map((r) => {
          const isSelected = r.id === selectedRouteId;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">{r.id}</span>
                {r.mode === 'TRAIN' ? (
                  <Train className="w-3 h-3 text-sky-400" />
                ) : (
                  <Bus className="w-3 h-3 text-amber-400" />
                )}
              </div>
              <div className="text-[11px] truncate text-slate-300 mt-1">
                {r.origin} → {r.destination}
              </div>
              <div className="text-[10px] font-mono mt-1 text-slate-400">
                {r.occupancyPercentage}% Load
              </div>
            </button>
          );
        })}
      </section>

      {/* Route Header Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-white border border-slate-700">
                ROUTE {selectedRoute.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedRoute.mode === 'TRAIN' ? 'Central Suburban Rail' : 'BEST City Bus Service'}
              </span>
              <span className="text-xs text-slate-400">· {selectedRoute.distanceKm} km Corridor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {selectedRoute.name}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span>{selectedRoute.stops.length} Managed Stations</span>
              <span>·</span>
              <span>Scheduled Headway: {selectedRoute.mode === 'TRAIN' ? '6-8 min' : '12-15 min'}</span>
              <span>·</span>
              <span className="text-emerald-400">Growth: +{selectedRoute.weeklyGrowth}% WoW</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Current Occupancy Status</div>
              <div className="text-2xl font-black font-mono text-white">
                {dynamicOccupancy}%
              </div>
            </div>
            <DemandBadge level={selectedRoute.status} occupancy={dynamicOccupancy} />
          </div>
        </div>

        {/* 6 Key Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-800/80 mt-6">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Rated Fleet Capacity</div>
            <div className="text-base font-bold text-white font-mono mt-1 tabular-nums">
              {effectiveCapacity.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">{extra > 0 ? `+${extra} extra` : 'Standard'}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Average Ridership</div>
            <div className="text-base font-bold text-white font-mono mt-1 tabular-nums">
              {Math.round(selectedRoute.capacity * 0.76).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Off-peak baseline</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Predicted Peak Demand</div>
            <div className="text-base font-bold text-cyan-300 font-mono mt-1 tabular-nums">
              {dynamicPredicted.toLocaleString()}
            </div>
            <div className="text-[10px] text-cyan-400/80">Morning Rush</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Average Occupancy</div>
            <div className="text-base font-bold text-white font-mono mt-1 tabular-nums">
              {selectedRoute.averageOccupancy}%
            </div>
            <div className="text-[10px] text-slate-500">24-hour cycle</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Peak Occupancy</div>
            <div className={`text-base font-bold font-mono mt-1 tabular-nums ${dynamicOccupancy > 100 ? 'text-rose-400' : 'text-amber-400'}`}>
              {dynamicOccupancy}%
            </div>
            <div className="text-[10px] text-slate-500">At peak hour</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Peak Window</div>
            <div className="text-base font-bold text-amber-300 font-mono mt-1">
              {selectedRoute.peakTime}
            </div>
            <div className="text-[10px] text-slate-500">Commute surge</div>
          </div>
        </div>
      </section>

      {/* Stop-by-Stop Load Progression Diagram */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Station-by-Station Load Accumulation
          </h2>
          <p className="text-xs text-slate-400">
            Identifies where passenger boarding creates unsafe carriage overcrowding along the corridor
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {stopLoads.map((s, idx) => (
            <div
              key={s.name}
              className={`p-4 rounded-xl border transition-all ${
                s.occupancy > 100
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : s.occupancy >= 80
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Stop #{s.sequence}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                  s.occupancy > 100 ? 'bg-rose-500/20 text-rose-300' : s.occupancy >= 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {s.occupancy}%
                </span>
              </div>
              <div className="text-sm font-bold text-white mt-1">{s.name}</div>
              <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">Boarding Volume:</span>
                <span className="font-mono font-semibold text-white">{s.demand.toLocaleString()} pax</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.occupancy > 100 ? 'bg-rose-500' : s.occupancy >= 80 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                  style={{ width: `${Math.min(100, s.occupancy)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 24-Hour Route Demand Curve */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              24-Hour Passenger Distribution ({selectedRoute.id})
            </h2>
            <p className="text-xs text-slate-400">Simulated demand curves across entire day</p>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            Capacity: {effectiveCapacity} seats
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyProfile} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Bar dataKey="predictedDemand" radius={[4, 4, 0, 0]}>
                {hourlyProfile.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={entry.predictedDemand > effectiveCapacity ? '#f43f5e' : entry.isPeak ? '#06b6d4' : '#334155'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
};
