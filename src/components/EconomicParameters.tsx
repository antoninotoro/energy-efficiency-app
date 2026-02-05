'use client';

import { motion } from 'framer-motion';
import { Euro, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function EconomicParameters() {
  const { economicParams, updateEconomicParams } = useEnergyStore();

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 blur-lg opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-2xl">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Parametri Economici</h2>
          <p className="text-slate-400 text-base mt-1">Configura prezzi e parametri finanziari</p>
        </div>
      </motion.div>

      {/* Prezzi Energia */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
            <Euro className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Prezzi Energia</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Parametri Finanziari */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Parametri Finanziari</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Utilizzato per calcolare NPV</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Crescita annua prezzi energia</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Costi manutenzione annui</p>
          </div>
        </div>
      </motion.div>

      {/* Durata Analisi */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Durata Analisi</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
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
              className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
            />
            <p className="text-xs text-slate-500 mt-2">Durata tipica: 20-25 anni per FV</p>
          </div>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5"
      >
        <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
          <span className="text-blue-400">ℹ️</span>
          Note sui Parametri
        </h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              Il <strong className="text-white">tasso di sconto</strong> viene usato per calcolare NPV e payback attualizzato
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              L&apos;<strong className="text-white">inflazione</strong> viene applicata ai prezzi dell&apos;energia anno su anno
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              I costi <strong className="text-white">O&M</strong> (Operation & Maintenance) sono calcolati come % del CAPEX annuale
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p>
              La durata standard dell&apos;analisi è <strong className="text-white">20 anni</strong> (vita utile tipica impianto FV)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
