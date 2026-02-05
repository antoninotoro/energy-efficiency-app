'use client';

import { motion } from 'framer-motion';
import { Sun, Battery, Thermometer, Lightbulb, Settings } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function TechConfigurator() {
  const { techConfig, updateTechConfig } = useEnergyStore();

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Configurazione Tecnologie</h2>
          <p className="text-slate-400 text-base mt-1">Seleziona e configura le tecnologie da installare</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Fotovoltaico */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                <Sun className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Fotovoltaico</h3>
                <p className="text-slate-400 text-sm mt-1">Impianto di produzione energia solare</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techConfig.photovoltaic.enabled}
                onChange={(e) =>
                  updateTechConfig({
                    photovoltaic: { ...techConfig.photovoltaic, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-20 h-10 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500 shadow-lg"></div>
              <span className="ml-4 text-base font-medium text-white">
                {techConfig.photovoltaic.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.photovoltaic.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Potenza di Picco (kWp)
                </label>
                <input
                  type="number"
                  value={techConfig.photovoltaic.peakPowerKwp}
                  onChange={(e) =>
                    updateTechConfig({
                      photovoltaic: {
                        ...techConfig.photovoltaic,
                        peakPowerKwp: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Costo Unitario (€/kWp)
                </label>
                <input
                  type="number"
                  value={techConfig.photovoltaic.unitCostEuroPerKwp}
                  onChange={(e) =>
                    updateTechConfig({
                      photovoltaic: {
                        ...techConfig.photovoltaic,
                        unitCostEuroPerKwp: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Batteria */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                <Battery className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Sistema di Accumulo (BESS)</h3>
                <p className="text-slate-400 text-sm mt-1">Batteria per massimizzare l'autoconsumo</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techConfig.battery.enabled}
                onChange={(e) =>
                  updateTechConfig({
                    battery: { ...techConfig.battery, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-20 h-10 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500 shadow-lg"></div>
              <span className="ml-4 text-base font-medium text-white">
                {techConfig.battery.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.battery.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Capacità (kWh)
                </label>
                <input
                  type="number"
                  value={techConfig.battery.capacityKwh}
                  onChange={(e) =>
                    updateTechConfig({
                      battery: {
                        ...techConfig.battery,
                        capacityKwh: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Potenza (kW)
                </label>
                <input
                  type="number"
                  value={techConfig.battery.powerKw}
                  onChange={(e) =>
                    updateTechConfig({
                      battery: {
                        ...techConfig.battery,
                        powerKw: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Costo (€/kWh)
                </label>
                <input
                  type="number"
                  value={techConfig.battery.unitCostEuroPerKwh}
                  onChange={(e) =>
                    updateTechConfig({
                      battery: {
                        ...techConfig.battery,
                        unitCostEuroPerKwh: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Pompa di Calore */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                <Thermometer className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Pompa di Calore</h3>
                <p className="text-slate-400 text-sm mt-1">Elettrificazione dei consumi termici</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techConfig.heatPump.enabled}
                onChange={(e) =>
                  updateTechConfig({
                    heatPump: { ...techConfig.heatPump, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-20 h-10 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-red-500 peer-checked:to-pink-500 shadow-lg"></div>
              <span className="ml-4 text-base font-medium text-white">
                {techConfig.heatPump.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.heatPump.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Potenza Termica (kW)
                </label>
                <input
                  type="number"
                  value={techConfig.heatPump.thermalPowerKw}
                  onChange={(e) =>
                    updateTechConfig({
                      heatPump: {
                        ...techConfig.heatPump,
                        thermalPowerKw: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  COP
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={techConfig.heatPump.cop}
                  onChange={(e) =>
                    updateTechConfig({
                      heatPump: {
                        ...techConfig.heatPump,
                        cop: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Costo (€)
                </label>
                <input
                  type="number"
                  value={techConfig.heatPump.unitCostEuro}
                  onChange={(e) =>
                    updateTechConfig({
                      heatPump: {
                        ...techConfig.heatPump,
                        unitCostEuro: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* LED Relamping */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-8 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-4 rounded-2xl shadow-lg">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Relamping LED</h3>
                <p className="text-slate-400 text-sm mt-1">Efficientamento sistema illuminazione</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={techConfig.ledRelamping.enabled}
                onChange={(e) =>
                  updateTechConfig({
                    ledRelamping: { ...techConfig.ledRelamping, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-20 h-10 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-yellow-500 shadow-lg"></div>
              <span className="ml-4 text-base font-medium text-white">
                {techConfig.ledRelamping.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.ledRelamping.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Potenza Vecchia (kW)
                </label>
                <input
                  type="number"
                  value={techConfig.ledRelamping.oldPowerKw}
                  onChange={(e) =>
                    updateTechConfig({
                      ledRelamping: {
                        ...techConfig.ledRelamping,
                        oldPowerKw: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Potenza LED (kW)
                </label>
                <input
                  type="number"
                  value={techConfig.ledRelamping.newPowerKw}
                  onChange={(e) =>
                    updateTechConfig({
                      ledRelamping: {
                        ...techConfig.ledRelamping,
                        newPowerKw: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Ore/Anno
                </label>
                <input
                  type="number"
                  value={techConfig.ledRelamping.operatingHoursPerYear}
                  onChange={(e) =>
                    updateTechConfig({
                      ledRelamping: {
                        ...techConfig.ledRelamping,
                        operatingHoursPerYear: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-5 py-4 text-lg font-semibold bg-slate-800/50 border-2 border-slate-600 rounded-xl text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
