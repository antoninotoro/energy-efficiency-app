'use client';

import { Euro, TrendingUp, Calendar } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function EconomicParameters() {
  const { economicParams, updateEconomicParams } = useEnergyStore();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Prezzi Energia */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
            <Euro className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prezzi Energia</h3>
            <p className="text-sm text-slate-500">Configura i prezzi di riferimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Prezzo Elettricità (€/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={economicParams.electricityPriceEuroPerKwh}
              onChange={(e) =>
                updateEconomicParams({
                  electricityPriceEuroPerKwh: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
          </div>
          <div>
            <label>Prezzo Immissione Rete (€/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={economicParams.gridExportPriceEuroPerKwh}
              onChange={(e) =>
                updateEconomicParams({
                  gridExportPriceEuroPerKwh: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
          </div>
          <div>
            <label>Prezzo Gas (€/Sm³)</label>
            <input
              type="number"
              step="0.01"
              value={economicParams.gasPriceEuroPerSm3}
              onChange={(e) =>
                updateEconomicParams({
                  gasPriceEuroPerSm3: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
          </div>
          <div>
            <label>Prezzo Gasolio (€/L)</label>
            <input
              type="number"
              step="0.01"
              value={economicParams.dieselPriceEuroPerLiter}
              onChange={(e) =>
                updateEconomicParams({
                  dieselPriceEuroPerLiter: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
          </div>
        </div>
      </div>

      {/* Parametri Finanziari */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Parametri Finanziari</h3>
            <p className="text-sm text-slate-500">Setup analisi economica</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Tasso di Sconto (%)</label>
            <input
              type="number"
              step="0.1"
              value={economicParams.discountRate}
              onChange={(e) =>
                updateEconomicParams({
                  discountRate: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
            <p className="text-xs text-slate-500 mt-1.5">Per calcolo NPV</p>
          </div>
          <div>
            <label>Inflazione (%)</label>
            <input
              type="number"
              step="0.1"
              value={economicParams.inflationRate}
              onChange={(e) =>
                updateEconomicParams({
                  inflationRate: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
            <p className="text-xs text-slate-500 mt-1.5">Crescita annua prezzi</p>
          </div>
          <div>
            <label>O&M (% CAPEX)</label>
            <input
              type="number"
              step="0.1"
              value={economicParams.omCostPercentage}
              onChange={(e) =>
                updateEconomicParams({
                  omCostPercentage: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
            <p className="text-xs text-slate-500 mt-1.5">Costi manutenzione</p>
          </div>
        </div>
      </div>

      {/* Durata Analisi */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Durata Analisi</h3>
            <p className="text-sm text-slate-500">Orizzonte temporale valutazione</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Anni di Analisi</label>
            <input
              type="number"
              value={economicParams.analysisYears}
              onChange={(e) =>
                updateEconomicParams({
                  analysisYears: parseInt(e.target.value) || 20,
                })
              }
              className="w-full px-4 py-2.5 rounded-lg mt-1"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Tipicamente 20-25 anni per impianti FV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
