import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Sparkles, 
  Train, 
  Bus, 
  ArrowRight,
  Shield,
  Leaf,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { TransitRoute, SimulationState } from '../types';
import { DemandBadge } from '../components/common/DemandBadge';

interface CitizenPortalPageProps {
  routes: TransitRoute[];
  simulation: SimulationState;
}

export const CitizenPortalPage: React.FC<CitizenPortalPageProps> = ({ routes, simulation }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('302');
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [travelModePreference, setTravelModePreference] = useState<'ALL' | 'TRAIN' | 'BUS'>('ALL');

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Extra vehicles dispatched in simulation
  const extraUnits = simulation.dispatchedExtras[selectedRoute.id] || 0;
  const effectiveCap = selectedRoute.capacity + (extraUnits * (selectedRoute.mode === 'BUS' ? 70 : 250));

  // Compute crowding for selected hour
  const getCrowdingForHour = (hour: number) => {
    let factor = 0.5;
    if (hour >= 8 && hour <= 10) factor = 1.35;
    else if (hour >= 17 && hour <= 20) factor = 1.25;
    else if (hour >= 22 || hour <= 5) factor = 0.20;
    else factor = 0.75;

    let mult = 1.0;
    if (simulation.weather === 'rain') mult = 1.08;
    if (simulation.weather === 'heavy_rain') mult = 1.18;
    if (simulation.hasSpecialEvent) mult = 1.25;

    const demand = Math.round(selectedRoute.capacity * factor * mult);
    const occupancy = Number(((demand / effectiveCap) * 100).toFixed(1));
    return { hour, demand, occupancy };
  };

  const currentCrowd = getCrowdingForHour(selectedHour);

  // Find better alternative departure time within 2 hours
  const candidateHours = [
    Math.max(5, selectedHour - 1),
    Math.min(23, selectedHour + 1),
    Math.min(23, selectedHour + 2)
  ].filter(h => h !== selectedHour);

  const betterAlternative = candidateHours
    .map(h => getCrowdingForHour(h))
    .sort((a, b) => a.occupancy - b.occupancy)[0];

  const occupancyDiff = Math.round(currentCrowd.occupancy - betterAlternative.occupancy);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Citizen Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-900/50 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            Citizen Commuter Portal · Smarter Daily Commutes
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Check Carriage Crowding <span className="text-cyan-400">Before</span> You Step Onto The Platform
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            MotionX empowers passengers to avoid peak-hour crush, plan comfortable departure windows, 
            and see live crowding predictions powered by municipal machine-learning models.
          </p>
        </div>
      </section>

      {/* Trip Planner & Live Crowding Checker */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Check Your Commute Crowding Level
            </h2>
            <p className="text-xs text-slate-400">
              Select your route and planned travel time to see expected coach crowding and seating availability
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
            Live ML Crowding Prediction
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Route Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Corridor / Line</label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.id} — {r.name.split('—')[1]?.trim() || r.name} ({r.mode})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Origin: {selectedRoute.origin} → Destination: {selectedRoute.destination}
            </span>
          </div>

          {/* Time Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Planned Departure Time</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="23"
                value={selectedHour}
                onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-cyan-300 font-bold text-sm w-16 text-right">
                {selectedHour.toString().padStart(2, '0')}:00
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Slide to test different hours of the day
            </span>
          </div>

          {/* Rapid Presets */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Quick Commute Presets</label>
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {[
                { label: '08:30 AM', hour: 8 },
                { label: '01:00 PM', hour: 13 },
                { label: '06:30 PM', hour: 18 }
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => setSelectedHour(p.hour)}
                  className={`text-xs py-2 rounded-lg border text-center font-medium transition-colors ${
                    selectedHour === p.hour
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Prediction Result Display for Citizen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          
          {/* Main Status Badge Card */}
          <div className={`p-5 rounded-2xl border ${
            currentCrowd.occupancy > 100
              ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
              : currentCrowd.occupancy >= 80
              ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
              : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
          } space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold">Predicted Crowd Level</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded font-bold bg-slate-900/80 text-white">
                {selectedHour}:00 HRS
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold font-mono">{currentCrowd.occupancy}%</span>
              <span className="text-sm font-semibold">
                {currentCrowd.occupancy > 100
                  ? 'Severe Crush · Heavy Overcrowding'
                  : currentCrowd.occupancy >= 80
                  ? 'High · Full Standing Room'
                  : currentCrowd.occupancy >= 60
                  ? 'Moderate · Comfortable'
                  : 'Low · Empty Seats Available'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentCrowd.occupancy > 100
                ? 'Expect full passenger pass-bys at intermediate stations. Boarding will be difficult. Consider the alternative departure window.'
                : currentCrowd.occupancy >= 80
                ? 'Most seating occupied. Ample standing room available with moderate platform dwell times.'
                : 'Excellent commute window. Plenty of seating and fast station boarding.'}
            </p>
          </div>

          {/* Smarter Time Recommendation Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Smarter Departure Suggestion
            </div>

            {occupancyDiff > 15 ? (
              <div className="space-y-2">
                <div className="text-sm text-slate-300 leading-snug">
                  If you shift departure to <strong className="text-cyan-300 font-mono">{betterAlternative.hour}:00 HRS</strong>:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    -{occupancyDiff}% Less Crowded
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({betterAlternative.occupancy}% load)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Avoid the rush surge by shifting your travel window by just 60 minutes.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Ideal Travel Window
                </div>
                <p className="text-xs text-slate-300">
                  Your selected departure time is already among the most comfortable times to commute today.
                </p>
              </div>
            )}

            {extraUnits > 0 && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transit authority deployed <strong>+{extraUnits} extra standby unit(s)</strong> on this route today!</span>
              </div>
            )}
          </div>

          {/* Coach Crowding Guide */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
                Carriage Load Distribution Guide
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Platform Tip</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Front Coaches (1-3)</span>
                <span className="font-mono text-emerald-400 font-semibold">Moderate · 62%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Middle Coaches (4-6)</span>
                <span className={`font-mono font-semibold ${currentCrowd.occupancy > 100 ? 'text-rose-400' : 'text-amber-400'}`}>
                  Crush Zone · {Math.min(150, Math.round(currentCrowd.occupancy * 1.15))}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Rear Coaches (7-9)</span>
                <span className="font-mono text-cyan-400 font-semibold">Fair · 78%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              *Middle carriages experience 25% higher density near staircases and escalators. Board towards either end for more comfort.
            </p>
          </div>

        </div>
      </section>

      {/* Commuter Benefits & Multi-modal Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Carbon & Green Impact</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Taking Route {selectedRoute.id} instead of a private car saves <strong>3.2 kg of CO₂</strong> and eliminates 14 km of roadway gridlock per trip.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Weather-Proof Travel Advisory</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {simulation.weather === 'heavy_rain' 
              ? 'Heavy monsoon active. Western & Central railways have deployed drainage sump pumps. Expect +15 min headway delays.'
              : 'Clear weather conditions. Suburban trains and BEST buses are operating with nominal 98.4% on-time performance.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Cost vs. Ride-Hailing</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Suburban rail ticket for this corridor is <strong>₹15</strong>, compared to ₹340–₹450 on surge-priced app cabs during rush hour.
          </p>
        </div>

      </section>

    </div>
  );
};
