'use client';

import { Euro, TrendingUp, Calendar } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function EconomicParameters() {
  const { economicParams, updateEconomicParams } = useEnergyStore();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Parametri Economici</h2>

      <div className="space-y-6">
        {/* Prezzi Energia */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Euro className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">Prezzi Energia</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Parametri Finanziari */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-800">Parametri Finanziari</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Durata Analisi */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Durata Analisi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Note sui Parametri</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Il <strong>tasso di sconto</strong> viene usato per calcolare NPV e payback attualizzato</li>
            <li>• L&apos;<strong>inflazione</strong> viene applicata ai prezzi dell&apos;energia anno su anno</li>
            <li>• I costi <strong>O&M</strong> (Operation & Maintenance) sono calcolati come % del CAPEX annuale</li>
            <li>• La durata standard dell&apos;analisi è <strong>20 anni</strong> (vita utile tipica impianto FV)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
