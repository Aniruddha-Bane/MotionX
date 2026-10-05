import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  Layers, 
  Filter, 
  Info, 
  AlertOctagon, 
  Bus, 
  Train, 
  Navigation2, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { TransitRoute, RouteStop, DemandLevel, SimulationState } from '../types';
import { MUMBAI_COORDINATES } from '../data/mumbaiTransitData';
import { DemandBadge } from '../components/common/DemandBadge';

interface MapPageProps {
  routes: TransitRoute[];
  simulation: SimulationState;
  onNavigateTab: (tab: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ routes, simulation, onNavigateTab }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedMode, setSelectedMode] = useState<'ALL' | 'TRAIN' | 'BUS'>('ALL');
  const [selectedCongestion, setSelectedCongestion] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [activeStop, setActiveStop] = useState<{ stop: RouteStop; route: TransitRoute } | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MUMBAI_COORDINATES.center,
      zoom: 11,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: true
    });

    // Dark sleek OpenStreetMap tiles (CartoDB Dark Matter / OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    polylinesLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Lines when filters or simulation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !polylinesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    polylinesLayerRef.current.clearLayers();

    const filteredRoutes = routes.filter((r) => {
      if (selectedMode !== 'ALL' && r.mode !== selectedMode) return false;
      return true;
    });

    // Draw route polylines
    filteredRoutes.forEach((route) => {
      const latlngs: [number, number][] = route.stops.map((s) => [s.lat, s.lng]);
      const isCritical = route.status === 'CRITICAL';
      const polyline = L.polyline(latlngs, {
        color: isCritical ? '#f43f5e' : route.mode === 'TRAIN' ? '#38bdf8' : '#eab308',
        weight: isCritical ? 4 : 3,
        opacity: isCritical ? 0.9 : 0.6,
        dashArray: route.mode === 'BUS' ? '6, 6' : undefined
      });
      polyline.addTo(polylinesLayerRef.current!);
    });

    // Draw stops as interactive custom SVG pulse markers
    filteredRoutes.forEach((route) => {
      const extraCap = (simulation.dispatchedExtras[route.id] || 0) * (route.mode === 'BUS' ? 70 : 250);
      const effectiveCap = route.capacity + extraCap;

      route.stops.forEach((stop) => {
        // Adjust demand dynamically based on simulation
        let adjustedDemand = stop.predictedDemand;
        if (simulation.weather === 'rain') adjustedDemand = Math.round(adjustedDemand * 1.08);
        if (simulation.weather === 'heavy_rain') adjustedDemand = Math.round(adjustedDemand * 1.18);
        if (simulation.hasSpecialEvent) adjustedDemand = Math.round(adjustedDemand * 1.25);

        const occupancy = Number(((adjustedDemand / effectiveCap) * 100).toFixed(1));
        let status: DemandLevel = 'LOW';
        if (occupancy > 100) status = 'CRITICAL';
        else if (occupancy >= 80) status = 'HIGH';
        else if (occupancy >= 60) status = 'MODERATE';

        // Filter by congestion
        if (selectedCongestion !== 'ALL' && status !== selectedCongestion) return;

        const colorMap: Record<DemandLevel, { fill: string; ring: string }> = {
          CRITICAL: { fill: '#f43f5e', ring: 'rgba(244, 63, 94, 0.4)' },
          HIGH: { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.3)' },
          MODERATE: { fill: '#38bdf8', ring: 'rgba(56, 189, 248, 0.3)' },
          LOW: { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.3)' }
        };

        const { fill, ring } = colorMap[status];
        const isPulse = status === 'CRITICAL';

        // Custom HTML marker
        const markerHtml = `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isPulse ? `<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${ring}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: ${fill}; border: 2px solid #0f172a; box-shadow: 0 0 8px ${fill};"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-transit-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([stop.lat, stop.lng], { icon });
        marker.on('click', () => {
          setActiveStop({
            stop: {
              ...stop,
              predictedDemand: adjustedDemand,
              capacity: effectiveCap,
              occupancyPercentage: occupancy,
              status
            },
            route
          });
        });

        marker.addTo(markersLayerRef.current!);
      });
    });
  }, [routes, selectedMode, selectedCongestion, simulation]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <MapIcon className="w-3.5 h-3.5" />
            Geospatial Diagnostics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Overcrowding Heat & Station Map
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time geospatial visualization of passenger demand, bottleneck hubs, and carriage crowding.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Mode Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['ALL', 'TRAIN', 'BUS'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  selectedMode === m ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Congestion Level Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCongestion(c)}
                className={`px-2.5 py-1.5 rounded font-medium transition-colors ${
                  selectedCongestion === c ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'CRITICAL' ? 'Over Cap' : c}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Map Card */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
        
        {/* Map Canvas */}
        <div ref={mapContainerRef} className="h-[560px] w-full z-10" />

        {/* Interactive Floating Stop Detail Inspector */}
        {activeStop && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 rounded-xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-md p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                {activeStop.route.mode === 'TRAIN' ? (
                  <Train className="w-4 h-4 text-sky-400" />
                ) : (
                  <Bus className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs font-bold text-white font-mono">
                  {activeStop.route.id}
                </span>
                <span className="text-xs text-slate-400 truncate max-w-[160px]">
                  {activeStop.route.name.split('—')[1]?.trim()}
                </span>
              </div>
              <button
                onClick={() => setActiveStop(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-400">Station / Terminus</div>
              <div className="text-base font-bold text-white">{activeStop.stop.name}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Demand</span>
                <div className="font-mono font-bold text-white text-sm">
                  {activeStop.stop.predictedDemand.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Capacity</span>
                <div className="font-mono font-bold text-slate-300 text-sm">
                  {activeStop.stop.capacity.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Occupancy</span>
                <div className={`font-mono font-bold text-sm ${activeStop.stop.occupancyPercentage > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeStop.stop.occupancyPercentage}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <DemandBadge level={activeStop.stop.status} occupancy={activeStop.stop.occupancyPercentage} />
              <button
                onClick={() => onNavigateTab('recommendations')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Action Plan <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-slate-800 bg-slate-950/90 backdrop-blur-md p-3 text-xs space-y-2">
          <div className="font-bold text-white uppercase text-[10px] tracking-wider">
            Congestion Classification
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Low (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Moderate (60-80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>High (80-100%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Over Capacity (&gt;100%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Synthetic Data Transparency Notice */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Geospatial Demo Notice:</span> Demo coordinates and synthetic transport data — not live operational data. MotionX currently uses synthetic demonstration data inspired by Mumbai public transport patterns (Central Railway, Western Railway, and BEST Bus networks). The architecture can later ingest real GTFS, AFC, GPS, ticketing, or transport authority datasets.
        </div>
      </div>

    </div>
  );
};
