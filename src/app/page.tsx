'use client';

import { useState } from 'react';
import { Settings, Calculator, BarChart3, DollarSign, Zap } from 'lucide-react';
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
    { id: 'import' as Tab, label: 'Carica Dati', icon: BarChart3 },
    { id: 'config' as Tab, label: 'Tecnologie', icon: Settings },
    { id: 'economics' as Tab, label: 'Parametri Economici', icon: DollarSign },
    { id: 'results' as Tab, label: 'Risultati', icon: Calculator },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-gradient-blue">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Energy Efficiency Platform
                </h1>
                <p className="text-gray-600 mt-1">
                  Dimensionamento Interventi Energetici C&I / B2G
                </p>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || podData.length === 0}
              className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
            >
              <Calculator className="h-6 w-6" />
              {isSimulating ? 'Simulazione in corso...' : 'Esegui Simulazione'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-base
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-blue text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="card p-8 fade-in">
          {activeTab === 'import' && <DataImporter />}
          {activeTab === 'config' && <TechConfigurator />}
          {activeTab === 'economics' && <EconomicParameters />}
          {activeTab === 'results' && <FinancialDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Energy Efficiency Platform - Dimensionamento Preliminare Interventi Energetici</p>
            <div className="flex items-center gap-6">
              <span className="font-semibold">Tecnologie: FV • BESS • PdC • LED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
