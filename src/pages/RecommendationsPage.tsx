import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Users, 
  Gauge, 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  HelpCircle,
  Bus,
  Train,
  Sliders,
  Check
} from 'lucide-react';
import { Recommendation, DemandLevel, SimulationState } from '../types';
import { INITIAL_RECOMMENDATIONS } from '../data/mumbaiTransitData';
import { DemandBadge } from '../components/common/DemandBadge';

interface RecommendationsPageProps {
  simulation: SimulationState;
  onDeployUnits: (routeId: string, units: number) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  simulation,
  onDeployUnits
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | DemandLevel>('ALL');
  const [appliedRecommendations, setAppliedRecommendations] = useState<Record<string, boolean>>({});

  const filteredRecs = INITIAL_RECOMMENDATIONS.filter((r) => {
    if (priorityFilter === 'ALL') return true;
    return r.priority === priorityFilter;
  });

  const handleApply = (rec: Recommendation) => {
    onDeployUnits(rec.routeId, rec.additionalVehicles || 1);
    setAppliedRecommendations(prev => ({ ...prev, [rec.id]: true }));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            Decision Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Service Allocation Recommendations
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Deterministic, explainable operational guidance that converts machine-learning demand forecasts into actionable fleet dispatches.
          </p>
        </div>

        {/* Priority Filters */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                priorityFilter === p
                  ? p === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations Cards Grid */}
      <div className="space-y-6">
        {filteredRecs.map((rec) => {
          const isApplied = appliedRecommendations[rec.id] || (simulation.dispatchedExtras[rec.routeId] || 0) > 0;
          const extraUnits = simulation.dispatchedExtras[rec.routeId] || 0;
          const extraCapacity = extraUnits * (rec.mode === 'BUS' ? 70 : 250);
          const currentEffCapacity = rec.capacity + extraCapacity;
          const currentOccupancy = Number(((rec.predictedDemand / currentEffCapacity) * 100).toFixed(1));

          return (
            <div
              key={rec.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                rec.priority === 'CRITICAL'
                  ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900/80 to-slate-900/60 shadow-lg shadow-rose-950/20'
                  : rec.priority === 'HIGH'
                  ? 'border-amber-500/30 bg-slate-900/60'
                  : 'border-slate-800 bg-slate-900/40'
              }`}
            >
              {/* Card Header Strip */}
              <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    rec.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {rec.mode === 'TRAIN' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <DemandBadge level={rec.priority} />
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {rec.timeWindow}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{rec.routeName}</h3>
                  </div>
                </div>

                {/* Status or Deploy Button */}
                <div className="flex items-center gap-3">
                  {isApplied ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Mitigation Deployed (+{extraUnits || rec.additionalVehicles} Units)
                    </div>
                  ) : rec.additionalVehicles > 0 ? (
                    <button
                      onClick={() => handleApply(rec)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                        rec.priority === 'CRITICAL'
                          ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Execute Fleet Dispatch (+{rec.additionalVehicles})
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Operational Schedule Update</span>
                  )}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-950/40 border-b border-slate-800/60">
                <div>
                  <div className="text-[11px] text-slate-400">Predicted Demand</div>
                  <div className="text-xl font-extrabold text-white font-mono mt-0.5 tabular-nums">
                    {rec.predictedDemand.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">During peak window</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Current Fleet Capacity</div>
                  <div className="text-xl font-extrabold text-slate-300 font-mono mt-0.5 tabular-nums">
                    {currentEffCapacity.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">{extraUnits > 0 ? `Includes +${extraCapacity} extra seats` : 'Base physical ceiling'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Expected Occupancy</div>
                  <div className={`text-xl font-black font-mono mt-0.5 tabular-nums ${
                    currentOccupancy > 100 ? 'text-rose-400' : currentOccupancy >= 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {currentOccupancy}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentOccupancy > 100 ? 'Overcrowded' : 'Nominal load'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Target Relief Impact</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 tabular-nums">
                    {rec.impactPercentage > 0 ? `-${rec.impactPercentage}%` : 'Optimal'}
                  </div>
                  <div className="text-[10px] text-slate-500">Occupancy reduction</div>
                </div>
              </div>

              {/* Action and Explainable Reasoning */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Proposed Action */}
                <div className="lg:col-span-1 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Recommended Action
                    </span>
                    <p className="text-sm font-semibold text-white mt-1 leading-snug">
                      {rec.recommendedAction}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Expected Impact:
                    </span>
                    <p>{rec.expectedImpact}</p>
                  </div>
                </div>

                {/* Prominent WHY THIS RECOMMENDATION? */}
                <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Why This Recommendation? (Explainable Logic)
                    </h4>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {rec.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
