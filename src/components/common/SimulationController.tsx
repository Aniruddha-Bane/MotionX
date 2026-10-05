import React from 'react';
import { CloudRain, Sun, Zap, Clock, RotateCcw, X, Bus, Train, AlertTriangle } from 'lucide-react';
import { SimulationState, WeatherCondition } from '../../types';

interface SimulationControllerProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationState;
  onUpdateSimulation: (updater: (prev: SimulationState) => SimulationState) => void;
  onReset: () => void;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  isOpen,
  onClose,
  simulation,
  onUpdateSimulation,
  onReset
}) => {
  if (!isOpen) return null;

  const hoursPreset = [
    { label: 'Morning Peak', hour: 8, sub: '08:30 AM' },
    { label: 'Midday Calm', hour: 13, sub: '01:00 PM' },
    { label: 'Evening Peak', hour: 18, sub: '06:30 PM' },
    { label: 'Night Low', hour: 23, sub: '11:00 PM' }
  ];

  return (
    <div className="border-b border-cyan-900/40 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Scenario Simulation Panel
            </h3>
            <span className="text-xs text-slate-400">
              · Tweak variables to test ML demand response & fleet recommendations in real-time
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition-colors"
              title="Reset simulation parameters"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              aria-label="Close simulation drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          
          {/* Time of Day Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time of Day
              </span>
              <span className="font-mono text-cyan-300 font-bold text-sm">
                {simulation.currentHour.toString().padStart(2, '0')}:00
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={simulation.currentHour}
              onChange={(e) => {
                const hour = parseInt(e.target.value);
                onUpdateSimulation((prev) => ({ ...prev, currentHour: hour }));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="grid grid-cols-4 gap-1 pt-1">
              {hoursPreset.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onUpdateSimulation((prev) => ({ ...prev, currentHour: p.hour }))}
                  className={`text-[10px] py-1 px-1 rounded text-center transition-colors ${
                    simulation.currentHour === p.hour
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Weather Impact
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'clear', label: 'Clear', icon: Sun, impact: 'Baseline' },
                { id: 'rain', label: 'Rain', icon: CloudRain, impact: '+8% demand' },
                { id: 'heavy_rain', label: 'Monsoon', icon: CloudRain, impact: '+18% road clog' }
              ].map((w) => {
                const Icon = w.icon;
                const isSelected = simulation.weather === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() =>
                      onUpdateSimulation((prev) => ({
                        ...prev,
                        weather: w.id as WeatherCondition
                      }))
                    }
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{w.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{w.impact}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Events & Day Type */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> External Triggers
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() =>
                  onUpdateSimulation((prev) => ({
                    ...prev,
                    hasSpecialEvent: !prev.hasSpecialEvent,
                    eventDescription: !prev.hasSpecialEvent ? 'IPL Match @ Wankhede & BKC Summit' : ''
                  }))
                }
                className={`w-full p-2 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                  simulation.hasSpecialEvent
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="font-semibold flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Special Event Surge
                  </div>
                  <div className="text-[10px] text-slate-400">Wankhede Stadium / BKC (+25%)</div>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${simulation.hasSpecialEvent ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                  {simulation.hasSpecialEvent ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() =>
                  onUpdateSimulation((prev) => ({
                    ...prev,
                    isWeekend: !prev.isWeekend
                  }))
                }
                className={`w-full p-2 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                  simulation.isWeekend
                    ? 'bg-purple-950/40 border-purple-500/60 text-purple-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="font-semibold">Weekend Travel Mode</div>
                  <div className="text-[10px] text-slate-400">Leisure curve vs Commuter peak</div>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${simulation.isWeekend ? 'bg-purple-400 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'}`}>
                  {simulation.isWeekend ? 'WEEKEND' : 'WEEKDAY'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Fleet Intervention */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Fleet Mitigation Test
            </span>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
              <div className="text-[11px] text-slate-300 leading-snug">
                Simulate dispatching extra units to Route 302 bottleneck:
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-300">
                  +{simulation.dispatchedExtras['302'] || 0} Extra Trains
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      onUpdateSimulation((prev) => {
                        const current = prev.dispatchedExtras['302'] || 0;
                        return {
                          ...prev,
                          dispatchedExtras: {
                            ...prev.dispatchedExtras,
                            '302': Math.max(0, current - 1)
                          }
                        };
                      })
                    }
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700"
                  >
                    -1
                  </button>
                  <button
                    onClick={() =>
                      onUpdateSimulation((prev) => {
                        const current = prev.dispatchedExtras['302'] || 0;
                        return {
                          ...prev,
                          dispatchedExtras: {
                            ...prev.dispatchedExtras,
                            '302': Math.min(5, current + 1)
                          }
                        };
                      })
                    }
                    className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded font-bold"
                  >
                    +1 Deploy
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {simulation.dispatchedExtras['302']
                  ? `Capacity boosted by +${(simulation.dispatchedExtras['302'] || 0) * 250} seats!`
                  : 'Zero standby units currently dispatched'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
