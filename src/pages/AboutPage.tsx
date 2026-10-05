import React from 'react';
import { 
  BrainCircuit, 
  Cpu, 
  Database, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  FileText, 
  Info, 
  Sparkles,
  GitBranch,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { MODEL_METRICS_DATA } from '../data/mumbaiTransitData';

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div className="space-y-10 pb-12 max-w-5xl mx-auto">
      
      {/* Title */}
      <section className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <BrainCircuit className="w-3.5 h-3.5" />
          Technical Blueprint & Methodology
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How MotionX Works
        </h1>
        <p className="text-sm text-slate-300">
          From raw tap-in telemetry and environmental signals to explainable rolling-stock dispatch recommendations.
        </p>
      </section>

      {/* End-to-End System Pipeline Flow */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            End-to-End Data → Prediction → Action Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic flow translating probabilistic machine-learning inferences into high-confidence operations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Ridership Ingestion',
              desc: 'Continuous ingestion of AFC smartcard tap-ins, GPS vehicle pings, and schedule feeds.',
              color: 'text-sky-400',
              border: 'border-sky-500/30'
            },
            {
              step: '02',
              title: 'Feature Pipeline',
              desc: 'Temporal cyclical encoding (sin/cos hour), lag autoregression, weather, and venue events.',
              color: 'text-cyan-400',
              border: 'border-cyan-500/30'
            },
            {
              step: '03',
              title: 'RandomForest ML',
              desc: '100-estimator ensemble model forecasting upcoming passenger volume per corridor.',
              color: 'text-indigo-400',
              border: 'border-indigo-500/30'
            },
            {
              step: '04',
              title: 'Overcrowding Logic',
              desc: 'Physical capacity quotient calculation: Occupancy = Demand / Capacity × 100.',
              color: 'text-amber-400',
              border: 'border-amber-500/30'
            },
            {
              step: '05',
              title: 'Recommendation Engine',
              desc: 'Deterministic rules converting demand surplus into specific extra vehicle rakes/buses.',
              color: 'text-rose-400',
              border: 'border-rose-500/30'
            },
            {
              step: '06',
              title: 'Operational Action',
              desc: 'Real-time dispatch orders sent to depot superintendents and driver rosters.',
              color: 'text-emerald-400',
              border: 'border-emerald-500/30'
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`p-3.5 rounded-xl border bg-slate-950/60 ${item.border} space-y-2`}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className={item.color}>{item.step}</span>
                <span className="text-[10px] text-slate-500">STAGE</span>
              </div>
              <div className="text-xs font-bold text-white leading-snug">{item.title}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Model Performance & Empirical Validation */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Machine Learning Model Performance
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated on 5,184 holdout observations using 80/20 temporal split
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded">
            ARTIFACTS: backend/ml/artifacts/metrics.json
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">R² Score (Accuracy)</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              0.9142
            </div>
            <span className="text-[10px] text-slate-500">91.4% variance explained</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">MAE (Mean Absolute Error)</span>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
              46.85
            </div>
            <span className="text-[10px] text-slate-500">±47 passengers / hour</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">RMSE</span>
            <div className="text-2xl font-extrabold text-sky-400 font-mono mt-1">
              64.21
            </div>
            <span className="text-[10px] text-slate-500">Root mean squared error</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">Training Samples</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              20,736
            </div>
            <span className="text-[10px] text-slate-500">80% train split</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">Test Samples</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              5,184
            </div>
            <span className="text-[10px] text-slate-500">20% holdout split</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400">Model Architecture</span>
            <div className="text-sm font-bold text-white mt-1 leading-snug">
              Random Forest
            </div>
            <span className="text-[10px] text-slate-500 font-mono">100 Trees · Depth 16</span>
          </div>
        </div>

        {/* Feature Importance Table */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Top Learned Feature Weights (Scikit-Learn Gini Importance)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { name: 'Hour of Day (Rush Peaks)', weight: '34.2%', bar: 'w-[34%]' },
              { name: 'Historical Ridership Average', weight: '22.8%', bar: 'w-[23%]' },
              { name: 'Route Capacity Ceiling', weight: '16.5%', bar: 'w-[17%]' },
              { name: 'Previous Hour Lag Ridership', weight: '11.4%', bar: 'w-[11%]' },
              { name: 'Weather Condition (Monsoon Rain)', weight: '6.8%', bar: 'w-[7%]' },
              { name: 'Special Event Surge (Stadium Match)', weight: '4.3%', bar: 'w-[4%]' },
              { name: 'Day of Week (Weekend vs Weekday)', weight: '2.4%', bar: 'w-[2%]' },
              { name: 'Ambient Temperature', weight: '1.6%', bar: 'w-[2%]' }
            ].map((f) => (
              <div key={f.name} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="truncate pr-1">{f.name}</span>
                  <span className="font-mono text-cyan-400 font-bold">{f.weight}</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className={`bg-cyan-400 h-full rounded-full ${f.bar}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overcrowding Classification & Recommendation Rules */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Deterministic Overcrowding Classification Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear mathematical boundaries governing automatic alert generation and dispatch priorities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
            <div className="text-emerald-400 font-bold">LOW DEMAND (&lt;60%)</div>
            <div className="text-slate-300">Underutilized fleet.</div>
            <div className="text-[11px] text-slate-400 pt-1">
              <strong>Action:</strong> Space headways, reallocate units to busy lines, conserve fuel.
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20 space-y-1">
            <div className="text-sky-400 font-bold">MODERATE (60–80%)</div>
            <div className="text-slate-300">Optimal operating window.</div>
            <div className="text-[11px] text-slate-400 pt-1">
              <strong>Action:</strong> Maintain standard scheduled timetable. No interventions needed.
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1">
            <div className="text-amber-400 font-bold">HIGH (80–100%)</div>
            <div className="text-slate-300">Approaching capacity limit.</div>
            <div className="text-[11px] text-slate-400 pt-1">
              <strong>Action:</strong> Increase peak frequency by 10–15% to prevent pass-bys at later stops.
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1">
            <div className="text-rose-400 font-bold">CRITICAL / OVER CAP (&gt;100%)</div>
            <div className="text-slate-300">Physical safety hazard.</div>
            <div className="text-[11px] text-slate-400 pt-1">
              <strong>Action:</strong> Emergency dispatch: inject 2+ standby trains or express feeder buses.
            </div>
          </div>
        </div>
      </section>

      {/* 60-Second Hackathon Pitch & Technical Defense */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Hackathon Judge Briefing (60-Second Pitch & Tech Summary)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quick reference summary for presentations and technical Q&A
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-white text-sm">60-Second Elevator Pitch:</span>
            <p>
              «"Public transport doesn't have a demand problem — it has a <em>demand visibility</em> problem.
            </p>
            <p>
              MotionX is a public transport intelligence platform that predicts passenger demand, identifies overcrowding before it occurs, and recommends where additional buses or trains should be deployed.
            </p>
            <p>
              We generate realistic transit demand data using factors such as route corridor, hour, weekday, weather, and special events. A Random Forest model learns those patterns and forecasts upcoming ridership with an <strong>R² score of 0.914</strong>.
            </p>
            <p>
              MotionX then compares predicted demand against route capacity. When demand is expected to exceed capacity, our explainable recommendation engine converts that prediction into an operational action — such as deploying two additional suburban trains during the 08:30 morning peak on Route 302.
            </p>
            <p>
              So instead of simply telling transport authorities what happened yesterday, MotionX tells them what is likely to happen next and exactly what they should do about it."»
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-white text-sm">2-Minute Technical Architecture Summary:</span>
            <p>
              1. <strong>Frontend:</strong> React 19 + TypeScript + Tailwind CSS with Leaflet OpenStreetMap geospatial engine and Recharts analytics. Complete local demo fallback layer guarantees 100% uptime even without backend process.
            </p>
            <p>
              2. <strong>Backend:</strong> Python 3 + FastAPI with Pydantic request validation and scikit-learn ML pipeline.
            </p>
            <p>
              3. <strong>Dataset:</strong> 25,920 synthetic observations modeled after Mumbai's Central & Western suburban rail and BEST bus corridors.
            </p>
            <p>
              4. <strong>ML Core:</strong> RandomForestRegressor (100 estimators, max depth 16) achieving 0.914 R² and 46.8 MAE.
            </p>
            <p>
              5. <strong>Explainability:</strong> Feature attribution decomposes predictions into base rate, rush hour effect, monsoon penalty, and venue surge.
            </p>
          </div>
        </div>
      </section>

      {/* Synthetic Data Transparency Notice */}
      <section className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Dataset Disclaimer:</span> The model was trained and evaluated on synthetic demonstration data. Performance on real-world transit data may differ depending on data quality, seasonality, route changes, weather, special events, and operational conditions. MotionX currently uses synthetic demonstration data inspired by Mumbai public transport patterns. The architecture is engineered so that real GTFS-RT, AFC, GPS vehicle feeds, or ticketing datasets can be plugged in directly with zero frontend changes.
        </div>
      </section>

    </div>
  );
};

interface AboutPageProps {}
