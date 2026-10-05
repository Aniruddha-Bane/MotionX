/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SimulationController } from './components/common/SimulationController';
import { DashboardPage } from './pages/DashboardPage';
import { UnifiedPredictorPage } from './pages/UnifiedPredictorPage';
import { ForecastPage } from './pages/ForecastPage';
import { RoutesPage } from './pages/RoutesPage';
import { MapPage } from './pages/MapPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CitizenPortalPage } from './pages/CitizenPortalPage';
import { AboutPage } from './pages/AboutPage';
import { TransitRoute, SimulationState } from './types';
import { INITIAL_ROUTES } from './data/mumbaiTransitData';
import { transitService } from './services/api';
import { CheckCircle2, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSimOpen, setIsSimOpen] = useState<boolean>(false);
  const [routes, setRoutes] = useState<TransitRoute[]>(INITIAL_ROUTES);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global simulation state
  const [simulation, setSimulation] = useState<SimulationState>({
    currentHour: 8,
    isWeekend: false,
    weather: 'clear',
    hasSpecialEvent: false,
    eventDescription: '',
    dispatchedExtras: {}
  });

  useEffect(() => {
    // Check if FastAPI backend is reachable on port 8000
    transitService.checkBackendHealth().then((isLive) => {
      setIsDemoMode(!isLive);
    });

    // Load initial routes
    transitService.getRoutes().then((data) => {
      if (data && data.length > 0) {
        setRoutes(data);
      }
    });
  }, []);

  // Dispatch additional units handler
  const handleDeployUnits = (routeId: string, units: number = 2) => {
    setSimulation((prev) => {
      const current = prev.dispatchedExtras[routeId] || 0;
      return {
        ...prev,
        dispatchedExtras: {
          ...prev.dispatchedExtras,
          [routeId]: current + units
        }
      };
    });

    const route = routes.find(r => r.id === routeId);
    const modeName = route?.mode === 'BUS' ? 'buses' : 'suburban trains';
    setToastMessage(`✓ Dispatched +${units} ${modeName} to Route ${routeId}! Capacity increased.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleResetSimulation = () => {
    setSimulation({
      currentHour: 8,
      isWeekend: false,
      weather: 'clear',
      hasSpecialEvent: false,
      eventDescription: '',
      dispatchedExtras: {}
    });
    setToastMessage('Simulation reset to default Mumbai baseline conditions.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-2xl">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimOpen={isSimOpen}
        setIsSimOpen={setIsSimOpen}
        isDemoMode={isDemoMode}
      />

      {/* Real-time Scenario Simulation Controller Drawer */}
      <SimulationController
        isOpen={isSimOpen}
        onClose={() => setIsSimOpen(false)}
        simulation={simulation}
        onUpdateSimulation={setSimulation}
        onReset={handleResetSimulation}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            routes={routes}
            simulation={simulation}
            onNavigateTab={setActiveTab}
            onDeployToRoute={(routeId) => handleDeployUnits(routeId, 2)}
          />
        )}

        {activeTab === 'unified' && (
          <UnifiedPredictorPage
            routes={routes}
            simulation={simulation}
            onDeployUnits={handleDeployUnits}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastPage
            routes={routes}
            simulation={simulation}
          />
        )}

        {activeTab === 'routes' && (
          <RoutesPage
            routes={routes}
            simulation={simulation}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            routes={routes}
            simulation={simulation}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsPage
            simulation={simulation}
            onDeployUnits={handleDeployUnits}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortalPage
            routes={routes}
            simulation={simulation}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Quiet Enterprise Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 mt-auto py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MotionX</span>
            <span>—</span>
            <span>Public Transport Intelligence Platform</span>
            <span>·</span>
            <span className="text-slate-400">Full Stack Developing Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('about')} className="hover:text-cyan-400 transition-colors">
              Methodology & Model Performance
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('recommendations')} className="hover:text-cyan-400 transition-colors">
              Dispatch Action Plan
            </button>
            <span>·</span>
            <span className="font-mono text-cyan-500/80">R² = 0.9142</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
