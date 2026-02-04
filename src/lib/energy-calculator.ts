import {
  TechnologyConfig,
  EnergyBalance,
  EconomicParameters,
  FinancialYear,
  ProjectResults,
  PODData,
  ThermalData,
  SimulationInput,
} from './types';

// Costanti
const HOURS_PER_YEAR = 8760;
const CO2_KG_PER_KWH = 0.3; // kg CO2 per kWh elettrico
const CO2_KG_PER_TREE = 20; // kg CO2 assorbita per albero/anno

/**
 * Genera un profilo di produzione fotovoltaica orario semplificato
 * Basato su un modello sinusoidale giornaliero
 */
export function generatePVProfile(
  peakPowerKwp: number,
  latitude: number = 45 // Italia centrale
): number[] {
  const profile: number[] = [];
  const peakHours = 1200; // Ore equivalenti di picco/anno in Italia

  for (let hour = 0; hour < HOURS_PER_YEAR; hour++) {
    const dayOfYear = Math.floor(hour / 24);
    const hourOfDay = hour % 24;

    // Variazione stagionale (più produzione in estate)
    const seasonalFactor = 0.7 + 0.3 * Math.cos(((dayOfYear - 172) * 2 * Math.PI) / 365);

    // Variazione giornaliera (produzione solo nelle ore diurne)
    let dailyFactor = 0;
    if (hourOfDay >= 6 && hourOfDay <= 18) {
      const solarAngle = ((hourOfDay - 6) * Math.PI) / 12;
      dailyFactor = Math.sin(solarAngle);
    }

    // Produzione oraria (kWh)
    const production = (peakPowerKwp * peakHours * seasonalFactor * dailyFactor) / HOURS_PER_YEAR;
    profile.push(Math.max(0, production));
  }

  return profile;
}

/**
 * Calcola il consumo elettrico incrementale dovuto all'elettrificazione termica
 */
export function calculateHeatPumpConsumption(
  thermalData: ThermalData | undefined,
  cop: number
): number[] {
  if (!thermalData) {
    return new Array(HOURS_PER_YEAR).fill(0);
  }

  // Energia termica annuale (kWh)
  let thermalEnergyKwh: number;
  if (thermalData.fuelType === 'gas') {
    // 1 Sm³ di gas = ~10.7 kWh termici
    thermalEnergyKwh = thermalData.annualConsumption * 10.7 * thermalData.boilerEfficiency;
  } else {
    // 1 L di gasolio = ~10 kWh termici
    thermalEnergyKwh = thermalData.annualConsumption * 10 * thermalData.boilerEfficiency;
  }

  // Energia elettrica necessaria alla PdC
  const electricEnergyKwh = thermalEnergyKwh / cop;

  // Distribuzione semplificata: più consumo in inverno
  const hourlyConsumption: number[] = [];
  for (let hour = 0; hour < HOURS_PER_YEAR; hour++) {
    const dayOfYear = Math.floor(hour / 24);
    // Più carico termico in inverno (giorno 0 = 1 gennaio)
    const seasonalFactor = 1.5 - 0.5 * Math.cos(((dayOfYear - 15) * 2 * Math.PI) / 365);
    hourlyConsumption.push((electricEnergyKwh * seasonalFactor) / HOURS_PER_YEAR);
  }

  return hourlyConsumption;
}

/**
 * Simula il bilancio energetico ora per ora con logica di batteria
 */
export function simulateEnergyBalance(
  consumptionProfile: number[],
  pvProfile: number[],
  batteryCapacityKwh: number,
  batteryPowerKw: number,
  batteryEfficiency: number
): EnergyBalance[] {
  const balance: EnergyBalance[] = [];
  let batterySoc = batteryCapacityKwh * 0.5; // Inizio al 50%

  for (let hour = 0; hour < HOURS_PER_YEAR; hour++) {
    const consumption = consumptionProfile[hour] || 0;
    const production = pvProfile[hour] || 0;
    const netEnergy = production - consumption;

    let directSelfConsumption = 0;
    let batteryCharge = 0;
    let batteryDischarge = 0;
    let gridImport = 0;
    let gridExport = 0;

    if (netEnergy >= 0) {
      // Surplus di produzione
      directSelfConsumption = consumption;

      // Prova a caricare la batteria
      const availableForCharge = netEnergy;
      const maxCharge = Math.min(
        batteryPowerKw,
        batteryCapacityKwh - batterySoc,
        availableForCharge
      );
      batteryCharge = maxCharge * batteryEfficiency;
      batterySoc += batteryCharge;

      // Eccesso immesso in rete
      gridExport = availableForCharge - maxCharge;
    } else {
      // Deficit di produzione
      directSelfConsumption = production;
      const deficit = -netEnergy;

      // Prova a scaricare la batteria
      const maxDischarge = Math.min(batteryPowerKw, batterySoc, deficit);
      batteryDischarge = maxDischarge;
      batterySoc -= batteryDischarge;

      // Restante prelievo dalla rete
      gridImport = deficit - batteryDischarge;
    }

    balance.push({
      hour,
      consumption,
      pvProduction: production,
      directSelfConsumption,
      batteryCharge,
      batteryDischarge,
      batterySOC: (batterySoc / batteryCapacityKwh) * 100,
      gridImport,
      gridExport,
    });
  }

  return balance;
}

/**
 * Calcola i risultati economici anno per anno
 */
export function calculateFinancialResults(
  energyBalance: EnergyBalance[],
  capex: number,
  economicParams: EconomicParameters,
  ledSavingsKwh: number
): FinancialYear[] {
  const results: FinancialYear[] = [];
  let cumulativeCashFlow = -capex;

  // Totali annuali dal bilancio energetico
  const annualGridImport = energyBalance.reduce((sum, h) => sum + h.gridImport, 0);
  const annualGridExport = energyBalance.reduce((sum, h) => sum + h.gridExport, 0);

  // Consumo baseline (prima degli interventi)
  const baselineConsumption = energyBalance.reduce((sum, h) => sum + h.consumption, 0);

  for (let year = 1; year <= economicParams.analysisYears; year++) {
    // Inflazione
    const inflationFactor = Math.pow(1 + economicParams.inflationRate / 100, year - 1);
    const electricityPrice = economicParams.electricityPriceEuroPerKwh * inflationFactor;

    // Risparmi elettrici (consumo evitato + autoconsumo + LED)
    const electricitySavings =
      (baselineConsumption - annualGridImport + ledSavingsKwh) * electricityPrice;

    // Ricavi da immissione in rete
    const gridExportRevenue = annualGridExport * economicParams.gridExportPriceEuroPerKwh;

    const totalRevenue = electricitySavings + gridExportRevenue;

    // Costi O&M
    const omCosts = (capex * economicParams.omCostPercentage) / 100;

    // Margine Lordo
    const grossMargin = totalRevenue - omCosts;

    // EBITDA (in questo caso semplificato = Gross Margin)
    const ebitda = grossMargin;

    // Ammortamento
    const depreciation = capex / economicParams.analysisYears;

    // EBIT
    const ebit = ebitda - depreciation;

    // Tasse (ipotesi 24% su utile positivo)
    const taxes = ebit > 0 ? ebit * 0.24 : 0;

    // Utile Netto
    const netIncome = ebit - taxes;

    // Cash Flow (aggiungiamo l'ammortamento)
    const cashFlow = netIncome + depreciation;
    cumulativeCashFlow += cashFlow;

    results.push({
      year,
      electricitySavings,
      thermalSavings: 0, // Già incluso in electricitySavings
      gridExportRevenue,
      totalRevenue,
      omCosts,
      grossMargin,
      ebitda,
      depreciation,
      ebit,
      taxes,
      netIncome,
      cashFlow,
      cumulativeCashFlow,
    });
  }

  return results;
}

/**
 * Calcola i KPI finanziari (NPV, IRR, Payback)
 */
export function calculateFinancialKPIs(
  financialResults: FinancialYear[],
  capex: number,
  discountRate: number
): {
  npv: number;
  irr: number;
  simplePayback: number;
  discountedPayback: number;
} {
  // NPV
  let npv = -capex;
  let discountedCumulative = -capex;
  let discountedPayback = -1;

  for (const year of financialResults) {
    const discountFactor = Math.pow(1 + discountRate / 100, year.year);
    const discountedCF = year.cashFlow / discountFactor;
    npv += discountedCF;
    discountedCumulative += discountedCF;

    if (discountedPayback === -1 && discountedCumulative >= 0) {
      discountedPayback = year.year;
    }
  }

  // Simple Payback
  let simplePayback = -1;
  for (const year of financialResults) {
    if (year.cumulativeCashFlow >= 0) {
      simplePayback = year.year;
      break;
    }
  }

  // IRR (Iterativo con Newton-Raphson semplificato)
  let irr = 10; // Stima iniziale 10%
  for (let i = 0; i < 20; i++) {
    let f = -capex;
    let fPrime = 0;

    for (const year of financialResults) {
      const factor = Math.pow(1 + irr / 100, year.year);
      f += year.cashFlow / factor;
      fPrime -= (year.year * year.cashFlow) / (factor * (1 + irr / 100));
    }

    const irrNext = irr - (f / fPrime) * 100;
    if (Math.abs(irrNext - irr) < 0.01) break;
    irr = irrNext;
  }

  return {
    npv,
    irr,
    simplePayback: simplePayback > 0 ? simplePayback : 99,
    discountedPayback: discountedPayback > 0 ? discountedPayback : 99,
  };
}

/**
 * Funzione principale di simulazione
 */
export function runSimulation(input: SimulationInput): ProjectResults {
  const { podData, thermalData, techConfig, economicParams } = input;

  // 1. Calcola consumo totale (aggregato di tutti i POD)
  const totalConsumption = podData.reduce((sum, pod) => sum + pod.annualConsumption, 0);
  const maxPower = podData.reduce((sum, pod) => sum + pod.maxPower, 0);

  // Profilo di carico aggregato (semplificato: media dei profili normalizzati)
  const consumptionProfile: number[] = new Array(HOURS_PER_YEAR).fill(0);
  for (const pod of podData) {
    for (let h = 0; h < HOURS_PER_YEAR; h++) {
      consumptionProfile[h] += pod.hourlyProfile[h] || totalConsumption / HOURS_PER_YEAR;
    }
  }

  // 2. Aggiungi consumo elettrico da PdC
  let heatPumpConsumption: number[] = new Array(HOURS_PER_YEAR).fill(0);
  if (techConfig.heatPump.enabled && thermalData) {
    heatPumpConsumption = calculateHeatPumpConsumption(thermalData, techConfig.heatPump.cop);
    for (let h = 0; h < HOURS_PER_YEAR; h++) {
      consumptionProfile[h] += heatPumpConsumption[h];
    }
  }

  // 3. Calcola risparmio LED
  let ledSavingsKwh = 0;
  if (techConfig.ledRelamping.enabled) {
    const powerSaving = techConfig.ledRelamping.oldPowerKw - techConfig.ledRelamping.newPowerKw;
    ledSavingsKwh = powerSaving * techConfig.ledRelamping.operatingHoursPerYear;
  }

  // 4. Genera profilo FV
  let pvProfile: number[] = new Array(HOURS_PER_YEAR).fill(0);
  if (techConfig.photovoltaic.enabled) {
    pvProfile = generatePVProfile(techConfig.photovoltaic.peakPowerKwp);
  }

  // 5. Simula bilancio energetico
  const batteryCapacity = techConfig.battery.enabled ? techConfig.battery.capacityKwh : 0;
  const batteryPower = techConfig.battery.enabled ? techConfig.battery.powerKw : 0;
  const batteryEfficiency = techConfig.battery.enabled ? techConfig.battery.efficiency : 0.9;

  const energyBalance = simulateEnergyBalance(
    consumptionProfile,
    pvProfile,
    batteryCapacity,
    batteryPower,
    batteryEfficiency
  );

  // 6. Calcola CAPEX
  const capex = {
    photovoltaic: techConfig.photovoltaic.enabled
      ? techConfig.photovoltaic.peakPowerKwp * techConfig.photovoltaic.unitCostEuroPerKwp
      : 0,
    battery: techConfig.battery.enabled
      ? techConfig.battery.capacityKwh * techConfig.battery.unitCostEuroPerKwh
      : 0,
    heatPump: techConfig.heatPump.enabled ? techConfig.heatPump.unitCostEuro : 0,
    ledRelamping: techConfig.ledRelamping.enabled ? techConfig.ledRelamping.unitCostEuro : 0,
    total: 0,
  };
  capex.total = capex.photovoltaic + capex.battery + capex.heatPump + capex.ledRelamping;

  // 7. Calcola risultati finanziari
  const yearlyResults = calculateFinancialResults(
    energyBalance,
    capex.total,
    economicParams,
    ledSavingsKwh
  );

  const financialKPIs = calculateFinancialKPIs(
    yearlyResults,
    capex.total,
    economicParams.discountRate
  );

  // 8. Metriche energetiche
  const annualPvProduction = pvProfile.reduce((sum, h) => sum + h, 0);
  const totalSelfConsumption =
    energyBalance.reduce((sum, h) => sum + h.directSelfConsumption, 0) +
    energyBalance.reduce((sum, h) => sum + h.batteryDischarge, 0);
  const totalConsumptionWithHP = consumptionProfile.reduce((sum, h) => sum + h, 0);
  const totalGridImport = energyBalance.reduce((sum, h) => sum + h.gridImport, 0);

  const selfConsumptionRate =
    annualPvProduction > 0 ? (totalSelfConsumption / annualPvProduction) * 100 : 0;
  const selfSufficiencyRate =
    totalConsumptionWithHP > 0 ? (totalSelfConsumption / totalConsumptionWithHP) * 100 : 0;
  const gridImportReduction =
    totalConsumption > 0 ? ((totalConsumption - totalGridImport) / totalConsumption) * 100 : 0;

  const co2AvoidedTonnes = (annualPvProduction * CO2_KG_PER_KWH) / 1000;
  const equivalentTrees = (co2AvoidedTonnes * 1000) / CO2_KG_PER_TREE;

  return {
    capex,
    energyMetrics: {
      annualPvProduction,
      selfConsumptionRate,
      selfSufficiencyRate,
      gridImportReduction,
      co2AvoidedTonnes,
      equivalentTrees,
    },
    financialMetrics: {
      simplePayback: financialKPIs.simplePayback,
      discountedPayback: financialKPIs.discountedPayback,
      npv: financialKPIs.npv,
      irr: financialKPIs.irr,
    },
    yearlyResults,
    energyBalance,
  };
}
