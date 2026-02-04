import { create } from 'zustand';
import {
  PODData,
  ThermalData,
  TechnologyConfig,
  EconomicParameters,
  ProjectResults,
  SimulationInput,
} from '@/lib/types';
import { runSimulation } from '@/lib/energy-calculator';

interface EnergyStore {
  // Dati input
  podData: PODData[];
  thermalData: ThermalData | null;
  techConfig: TechnologyConfig;
  economicParams: EconomicParameters;

  // Risultati
  results: ProjectResults | null;
  isSimulating: boolean;

  // Actions
  setPODData: (data: PODData[]) => void;
  setThermalData: (data: ThermalData | null) => void;
  updateTechConfig: (config: Partial<TechnologyConfig>) => void;
  updateEconomicParams: (params: Partial<EconomicParameters>) => void;
  runSimulation: () => void;
  reset: () => void;
}

// Configurazione default delle tecnologie
const defaultTechConfig: TechnologyConfig = {
  photovoltaic: {
    enabled: true,
    peakPowerKwp: 100,
    unitCostEuroPerKwp: 1000,
    degradationRate: 0.5,
  },
  battery: {
    enabled: false,
    capacityKwh: 50,
    powerKw: 50,
    unitCostEuroPerKwh: 600,
    efficiency: 0.9,
    cycleLife: 6000,
  },
  heatPump: {
    enabled: false,
    thermalPowerKw: 50,
    cop: 3.0,
    unitCostEuro: 15000,
  },
  ledRelamping: {
    enabled: false,
    oldPowerKw: 20,
    newPowerKw: 10,
    operatingHoursPerYear: 3000,
    unitCostEuro: 5000,
  },
};

// Parametri economici default
const defaultEconomicParams: EconomicParameters = {
  electricityPriceEuroPerKwh: 0.25,
  gasPriceEuroPerSm3: 1.0,
  dieselPriceEuroPerLiter: 1.5,
  gridExportPriceEuroPerKwh: 0.10,
  discountRate: 5.0,
  analysisYears: 20,
  inflationRate: 2.0,
  omCostPercentage: 1.5,
};

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  // Stato iniziale
  podData: [],
  thermalData: null,
  techConfig: defaultTechConfig,
  economicParams: defaultEconomicParams,
  results: null,
  isSimulating: false,

  // Actions
  setPODData: (data) => set({ podData: data }),

  setThermalData: (data) => set({ thermalData: data }),

  updateTechConfig: (config) =>
    set((state) => ({
      techConfig: {
        ...state.techConfig,
        ...config,
        photovoltaic: {
          ...state.techConfig.photovoltaic,
          ...(config.photovoltaic || {}),
        },
        battery: {
          ...state.techConfig.battery,
          ...(config.battery || {}),
        },
        heatPump: {
          ...state.techConfig.heatPump,
          ...(config.heatPump || {}),
        },
        ledRelamping: {
          ...state.techConfig.ledRelamping,
          ...(config.ledRelamping || {}),
        },
      },
    })),

  updateEconomicParams: (params) =>
    set((state) => ({
      economicParams: {
        ...state.economicParams,
        ...params,
      },
    })),

  runSimulation: () => {
    const state = get();
    if (state.podData.length === 0) {
      console.error('Nessun dato POD disponibile');
      return;
    }

    set({ isSimulating: true });

    try {
      const input: SimulationInput = {
        podData: state.podData,
        thermalData: state.thermalData || undefined,
        techConfig: state.techConfig,
        economicParams: state.economicParams,
      };

      const results = runSimulation(input);
      set({ results, isSimulating: false });
    } catch (error) {
      console.error('Errore durante la simulazione:', error);
      set({ isSimulating: false });
    }
  },

  reset: () =>
    set({
      podData: [],
      thermalData: null,
      techConfig: defaultTechConfig,
      economicParams: defaultEconomicParams,
      results: null,
      isSimulating: false,
    }),
}));
