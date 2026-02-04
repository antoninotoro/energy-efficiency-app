'use client';

import { useState } from 'react';
import { Settings, Calculator, BarChart3, DollarSign } from 'lucide-react';
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
    { id: 'import' as Tab, label: 'Dati', icon: BarChart3 },
    { id: 'config' as Tab, label: 'Configurazione', icon: Settings },
    { id: 'economics' as Tab, label: 'Parametri Economici', icon: DollarSign },
    { id: 'results' as Tab, label: 'Risultati', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Energy Efficiency Platform
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Dimensionamento Interventi Energetici C&I / B2G
              </p>
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || podData.length === 0}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                transition-all duration-200 shadow-md
                ${
                  isSimulating || podData.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 hover:shadow-lg'
                }
              `}
            >
              <Calculator className="h-5 w-5" />
              {isSimulating ? 'Simulazione in corso...' : 'Esegui Simulazione'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'import' && <DataImporter />}
          {activeTab === 'config' && <TechConfigurator />}
          {activeTab === 'economics' && <EconomicParameters />}
          {activeTab === 'results' && <FinancialDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Energy Efficiency Platform - Dimensionamento Preliminare Interventi Energetici
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>FV • BESS • PdC • LED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
