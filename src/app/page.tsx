'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Calculator, BarChart3, DollarSign, Zap, Sparkles } from 'lucide-react';
import DataImporter from '@/components/DataImporter';
import TechConfigurator from '@/components/TechConfigurator';
import EconomicParameters from '@/components/EconomicParameters';
import FinancialDashboard from '@/components/FinancialDashboard';
import { useEnergyStore } from '@/store/useEnergyStore';

type Tab = 'import' | 'config' | 'economics' | 'results';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('import');
  const { podData, runSimulation, isSimulating } = useEnergyStore();

  const handleRunSimulation = () => {
    if (podData.length === 0) {
      alert('Carica prima i dati energetici!');
      return;
    }
    runSimulation();
    setActiveTab('results');
  };

  const tabs = [
    { id: 'import' as Tab, label: 'Dati', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    {
      id: 'config' as Tab,
      label: 'Configurazione',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'economics' as Tab,
      label: 'Parametri',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'results' as Tab,
      label: 'Risultati',
      icon: Calculator,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header with Glassmorphism */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass sticky top-0 z-50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50 rounded-full" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-2xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Energy Efficiency Platform</h1>
                <p className="mt-1 text-sm text-slate-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Dimensionamento Interventi Energetici C&I / B2G
                </p>
              </div>
            </motion.div>

            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunSimulation}
              disabled={isSimulating || podData.length === 0}
              className={`
                relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg
                transition-all duration-300 overflow-hidden group
                ${
                  isSimulating || podData.length === 0
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-blue-500/50'
                }
              `}
            >
              {/* Animated background */}
              {!isSimulating && podData.length > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              <Calculator className="h-6 w-6 relative z-10" />
              <span className="relative z-10">
                {isSimulating ? 'Simulazione in corso...' : 'Esegui Simulazione'}
              </span>

              {/* Shimmer effect */}
              {!isSimulating && podData.length > 0 && (
                <div className="absolute inset-0 shimmer opacity-30" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs with Modern Design */}
      <div className="glass border-b border-white/10 sticky top-[104px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 py-4" aria-label="Tabs">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
                    transition-all duration-300 overflow-hidden group
                    ${
                      isActive
                        ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="relative z-10">{tab.label}</span>

                  {/* Glow effect on active */}
                  {isActive && (
                    <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-500/50 to-purple-500/50 -z-10" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content with Animations */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-8 shadow-2xl"
          >
            {activeTab === 'import' && <DataImporter />}
            {activeTab === 'config' && <TechConfigurator />}
            {activeTab === 'economics' && <EconomicParameters />}
            {activeTab === 'results' && <FinancialDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with Modern Design */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="glass border-t border-white/10 mt-12 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Energy Efficiency Platform - Dimensionamento Preliminare Interventi Energetici
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse" />
                <span className="text-slate-400">FV</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" />
                <span className="text-slate-400">BESS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
                <span className="text-slate-400">PdC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse" />
                <span className="text-slate-400">LED</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
