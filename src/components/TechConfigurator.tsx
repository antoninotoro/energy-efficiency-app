'use client';

import { Sun, Battery, Thermometer, Lightbulb } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function TechConfigurator() {
  const { techConfig, updateTechConfig } = useEnergyStore();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Configurazione Tecnologie</h2>

      <div className="space-y-6">
        {/* Fotovoltaico */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sun className="h-6 w-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-800">Fotovoltaico</h3>
            </div>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {techConfig.photovoltaic.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Batteria */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Battery className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">Sistema di Accumulo (BESS)</h3>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {techConfig.battery.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potenza (kW)</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pompa di Calore */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Thermometer className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-800">Pompa di Calore</h3>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {techConfig.heatPump.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">COP</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo (€)</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* LED Relamping */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-semibold text-gray-800">Relamping LED</h3>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {techConfig.ledRelamping.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
