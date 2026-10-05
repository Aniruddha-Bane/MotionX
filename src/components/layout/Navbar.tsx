import React from 'react';
import { Activity, Sliders, Menu, X, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimOpen: boolean;
  setIsSimOpen: (open: boolean) => void;
  isDemoMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSimOpen,
  setIsSimOpen,
  isDemoMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'unified', label: 'Unified 3-in-1 Engine' },
    { id: 'forecast', label: 'Demand Forecast' },
    { id: 'routes', label: 'Route Analysis' },
    { id: 'map', label: 'Overcrowding Map' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'citizen', label: 'Citizen Hub' },
    { id: 'about', label: 'Methodology' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single element brand wordmark */}
        <button 
          onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              MotionX
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal">
              Transit Intelligence
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors whitespace-nowrap py-1 relative ${
                activeTab === item.id
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Demo Data indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              {isDemoMode ? 'DEMO DATA · MUMBAI' : 'LIVE API CONNECTED'}
            </span>
          </div>

          {/* Simulation Drawer Toggle */}
          <button
            onClick={() => setIsSimOpen(!isSimOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isSimOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
            title="Open Live Transit Simulation Controller"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulate Conditions</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-3">
            <span>Network: Mumbai Transit</span>
            <span className="font-mono text-cyan-400">25.2k Observations</span>
          </div>
        </div>
      )}
    </header>
  );
};
