// Types per l'applicazione di efficienza energetica

export interface EnergyData {
  timestamp: Date;
  powerKw: number;
  energyKwh: number;
}

export interface PODData {
  podId: string;
  maxPower: number; // kW
  annualConsumption: number; // kWh
  hourlyProfile: number[]; // Array di 8760 valori (ore/anno)
}

export interface ThermalData {
  fuelType: 'gas' | 'diesel';
  annualConsumption: number; // Sm³ per gas, Litri per diesel
  boilerEfficiency: number; // default 0.85
}

export interface TechnologyConfig {
  photovoltaic: {
    enabled: boolean;
    peakPowerKwp: number;
    unitCostEuroPerKwp: number;
    degradationRate: number; // %/anno
  };
  battery: {
    enabled: boolean;
    capacityKwh: number;
    powerKw: number;
    unitCostEuroPerKwh: number;
    efficiency: number; // round-trip efficiency
    cycleLife: number;
  };
  heatPump: {
    enabled: boolean;
    thermalPowerKw: number;
    cop: number; // Coefficient of Performance
    unitCostEuro: number;
  };
  ledRelamping: {
    enabled: boolean;
    oldPowerKw: number;
    newPowerKw: number;
    operatingHoursPerYear: number;
    unitCostEuro: number;
  };
}

export interface EnergyBalance {
  hour: number;
  consumption: number; // kWh
  pvProduction: number; // kWh
  directSelfConsumption: number; // kWh
  batteryCharge: number; // kWh
  batteryDischarge: number; // kWh
  batterySOC: number; // %
  gridImport: number; // kWh
  gridExport: number; // kWh
}

export interface EconomicParameters {
  electricityPriceEuroPerKwh: number;
  gasPriceEuroPerSm3: number;
  dieselPriceEuroPerLiter: number;
  gridExportPriceEuroPerKwh: number;
  discountRate: number; // %
  analysisYears: number; // default 20
  inflationRate: number; // %
  omCostPercentage: number; // % del CAPEX annuo
}

export interface FinancialYear {
  year: number;
  electricitySavings: number;
  thermalSavings: number;
  gridExportRevenue: number;
  totalRevenue: number;
  omCosts: number;
  grossMargin: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  taxes: number;
  netIncome: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

export interface ProjectResults {
  capex: {
    photovoltaic: number;
    battery: number;
    heatPump: number;
    ledRelamping: number;
    total: number;
  };
  energyMetrics: {
    annualPvProduction: number; // kWh
    selfConsumptionRate: number; // %
    selfSufficiencyRate: number; // %
    gridImportReduction: number; // %
    co2AvoidedTonnes: number;
    equivalentTrees: number;
  };
  financialMetrics: {
    simplePayback: number; // anni
    discountedPayback: number; // anni
    npv: number; // €
    irr: number; // %
  };
  yearlyResults: FinancialYear[];
  energyBalance: EnergyBalance[];
}

export interface SimulationInput {
  podData: PODData[];
  thermalData?: ThermalData;
  techConfig: TechnologyConfig;
  economicParams: EconomicParameters;
}
