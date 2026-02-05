'use client';

import { Euro, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function EconomicParameters() {
  const { economicParams, updateEconomicParams } = useEnergyStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="section-header">
        <div className="icon-box bg-gradient-orange">
          <DollarSign className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parametri Economici</h2>
          <p className="text-gray-600">Configura prezzi e parametri finanziari</p>
        </div>
      </div>

      {/* Prezzi Energia */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box bg-gradient-blue">
            <Euro className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Prezzi Energia</h3>
        </div>

        <div className="form-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prezzo Elettricità (€/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={economicParams.electricityPriceEuroPerKwh}
                onChange={(e) =>
                  updateEconomicParams({
                    electricityPriceEuroPerKwh: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prezzo Immissione Rete (€/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={economicParams.gridExportPriceEuroPerKwh}
                onChange={(e) =>
                  updateEconomicParams({
                    gridExportPriceEuroPerKwh: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prezzo Gas (€/Sm³)
              </label>
              <input
                type="number"
                step="0.01"
                value={economicParams.gasPriceEuroPerSm3}
                onChange={(e) =>
                  updateEconomicParams({
                    gasPriceEuroPerSm3: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prezzo Gasolio (€/L)
              </label>
              <input
                type="number"
                step="0.01"
                value={economicParams.dieselPriceEuroPerLiter}
                onChange={(e) =>
                  updateEconomicParams({
                    dieselPriceEuroPerLiter: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parametri Finanziari */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box bg-gradient-green">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Parametri Finanziari</h3>
        </div>

        <div className="form-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tasso di Sconto (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={economicParams.discountRate}
                onChange={(e) =>
                  updateEconomicParams({
                    discountRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Utilizzato per calcolare NPV</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Inflazione (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={economicParams.inflationRate}
                onChange={(e) =>
                  updateEconomicParams({
                    inflationRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Crescita annua prezzi energia</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                O&M (% CAPEX)
              </label>
              <input
                type="number"
                step="0.1"
                value={economicParams.omCostPercentage}
                onChange={(e) =>
                  updateEconomicParams({
                    omCostPercentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Costi manutenzione annui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Durata Analisi */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box bg-gradient-purple">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Durata Analisi</h3>
        </div>

        <div className="form-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Anni di Analisi
              </label>
              <input
                type="number"
                value={economicParams.analysisYears}
                onChange={(e) =>
                  updateEconomicParams({
                    analysisYears: parseInt(e.target.value) || 20,
                  })
                }
                className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Durata tipica: 20-25 anni per FV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="form-section border-blue-200 bg-blue-50">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <span className="text-blue-600">ℹ️</span>
          Note sui Parametri
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <span className="font-bold text-blue-600">•</span>
            <p>
              Il <strong className="text-gray-900">tasso di sconto</strong> viene usato per calcolare NPV e payback attualizzato
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-blue-600">•</span>
            <p>
              L&apos;<strong className="text-gray-900">inflazione</strong> viene applicata ai prezzi dell&apos;energia anno su anno
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-blue-600">•</span>
            <p>
              I costi <strong className="text-gray-900">O&M</strong> (Operation & Maintenance) sono calcolati come % del CAPEX annuale
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-blue-600">•</span>
            <p>
              La durata standard dell&apos;analisi è <strong className="text-gray-900">20 anni</strong> (vita utile tipica impianto FV)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
