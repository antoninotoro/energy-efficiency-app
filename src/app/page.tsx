'use client';

import { useState } from 'react';
import { Database, Settings, DollarSign, BarChart3, Zap, Check } from 'lucide-react';
import DataImporter from '@/components/DataImporter';
import TechConfigurator from '@/components/TechConfigurator';
import EconomicParameters from '@/components/EconomicParameters';
import FinancialDashboard from '@/components/FinancialDashboard';
import { useEnergyStore } from '@/store/useEnergyStore';

type Tab = 'import' | 'config' | 'economics' | 'results';

interface Step {
  id: Tab;
  label: string;
  icon: typeof Database;
  description: string;
}

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

  const steps: Step[] = [
    {
      id: 'import',
      label: 'Carica Dati',
      icon: Database,
      description: 'Upload profili energetici'
    },
    {
      id: 'config',
      label: 'Tecnologie',
      icon: Settings,
      description: 'Configura interventi'
    },
    {
      id: 'economics',
      label: 'Parametri Economici',
      icon: DollarSign,
      description: 'Setup analisi finanziaria'
    },
    {
      id: 'results',
      label: 'Risultati',
      icon: BarChart3,
      description: 'Dashboard KPI'
    },
  ];

  const getStepStatus = (stepId: Tab) => {
    const currentIndex = steps.findIndex(s => s.id === activeTab);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (stepId === activeTab) return 'active';
    if (stepIndex < currentIndex) return 'completed';
    return 'pending';
  };

  const isStepCompleted = (stepId: Tab) => {
    if (stepId === 'import') return podData.length > 0;
    if (stepId === 'config') return true; // Could add more validation
    if (stepId === 'economics') return true;
    return false;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Energy Platform</h1>
              <p className="text-xs text-slate-500">C&I / B2G Analysis</p>
            </div>
          </div>
        </div>

        <nav className="py-6">
          <div className="px-6 mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Workflow
            </p>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(step.id);
            const completed = isStepCompleted(step.id);

            return (
              <div
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`sidebar-item ${status === 'active' ? 'active' : ''} ${completed ? 'completed' : ''}`}
              >
                <div className={`step-indicator ${status === 'active' ? 'active' : ''} ${completed ? 'completed' : ''}`}>
                  {completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{step.label}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating || podData.length === 0}
            className="btn-success w-full flex items-center justify-center gap-2"
          >
            <BarChart3 className="h-5 w-5" />
            {isSimulating ? 'Simulazione...' : 'Esegui Simulazione'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {steps.find(s => s.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {steps.find(s => s.id === activeTab)?.description}
              </p>
            </div>

            {podData.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="badge badge-green">
                  {podData.length} POD caricati
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 max-w-7xl mx-auto">
          <div className="fade-in">
            {activeTab === 'import' && <DataImporter />}
            {activeTab === 'config' && <TechConfigurator />}
            {activeTab === 'economics' && <EconomicParameters />}
            {activeTab === 'results' && <FinancialDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}
