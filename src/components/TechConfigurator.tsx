'use client';

import { Sun, Battery, Thermometer, Lightbulb, Settings } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function TechConfigurator() {
  const { techConfig, updateTechConfig } = useEnergyStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="section-header">
        <div className="icon-box bg-gradient-purple">
          <Settings className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurazione Tecnologie</h2>
          <p className="text-gray-600">Seleziona e configura le tecnologie da installare</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fotovoltaico */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-gradient-orange">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Fotovoltaico</h3>
                <p className="text-gray-600 text-sm mt-1">Impianto di produzione energia solare</p>
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
              <div className="w-20 h-10 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-blue-500 shadow-md"></div>
              <span className="ml-4 text-base font-semibold text-gray-900">
                {techConfig.photovoltaic.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.photovoltaic.enabled && (
            <div className="form-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Batteria */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-gradient-green">
                <Battery className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Sistema di Accumulo (BESS)</h3>
                <p className="text-gray-600 text-sm mt-1">Batteria per massimizzare l&apos;autoconsumo</p>
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
              <div className="w-20 h-10 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-green-500 shadow-md"></div>
              <span className="ml-4 text-base font-semibold text-gray-900">
                {techConfig.battery.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.battery.enabled && (
            <div className="form-section">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pompa di Calore */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-gradient-red">
                <Thermometer className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pompa di Calore</h3>
                <p className="text-gray-600 text-sm mt-1">Elettrificazione dei consumi termici</p>
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
              <div className="w-20 h-10 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-red-500 shadow-md"></div>
              <span className="ml-4 text-base font-semibold text-gray-900">
                {techConfig.heatPump.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.heatPump.enabled && (
            <div className="form-section">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LED Relamping */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-gradient-orange" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Relamping LED</h3>
                <p className="text-gray-600 text-sm mt-1">Efficientamento sistema illuminazione</p>
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
              <div className="w-20 h-10 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-amber-500 shadow-md"></div>
              <span className="ml-4 text-base font-semibold text-gray-900">
                {techConfig.ledRelamping.enabled ? 'Attivo' : 'Inattivo'}
              </span>
            </label>
          </div>

          {techConfig.ledRelamping.enabled && (
            <div className="form-section">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 text-base font-semibold bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
