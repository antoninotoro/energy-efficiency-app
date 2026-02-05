'use client';

import { Sun, Battery, Thermometer, Lightbulb } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function TechConfigurator() {
  const { techConfig, updateTechConfig } = useEnergyStore();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Fotovoltaico */}
      <div className="card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Sun className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fotovoltaico</h3>
              <p className="text-sm text-slate-500">Impianto di produzione energia solare</p>
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
            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500"></div>
          </label>
        </div>

        {techConfig.photovoltaic.enabled && (
          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Potenza di Picco (kWp)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Costo Unitario (€/kWp)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batteria */}
      <div className="card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Battery className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sistema di Accumulo (BESS)</h3>
              <p className="text-sm text-slate-500">Batteria per massimizzare l&apos;autoconsumo</p>
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
            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-600 peer-checked:to-emerald-500"></div>
          </label>
        </div>

        {techConfig.battery.enabled && (
          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Capacità (kWh)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Potenza (kW)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Costo (€/kWh)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pompa di Calore */}
      <div className="card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Thermometer className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pompa di Calore</h3>
              <p className="text-sm text-slate-500">Elettrificazione dei consumi termici</p>
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
            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-red-600 peer-checked:to-red-500"></div>
          </label>
        </div>

        {techConfig.heatPump.enabled && (
          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Potenza Termica (kW)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>COP</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Costo (€)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LED Relamping */}
      <div className="card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Relamping LED</h3>
              <p className="text-sm text-slate-500">Efficientamento sistema illuminazione</p>
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
            <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-600 peer-checked:to-yellow-500"></div>
          </label>
        </div>

        {techConfig.ledRelamping.enabled && (
          <div className="pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Potenza Vecchia (kW)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Potenza LED (kW)</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
              <div>
                <label>Ore/Anno</label>
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
                  className="w-full px-4 py-2.5 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
