# Funzionalità Implementate - Energy Efficiency Platform

## Panoramica
Web Application completa per il dimensionamento preliminare di interventi energetici integrati nel settore C&I / B2G.

## Moduli Implementati

### 1. DataImporter Component (`/src/components/DataImporter.tsx`)
**Funzionalità:**
- Upload multiplo file CSV tramite drag & drop
- Parsing automatico con PapaParse
- Calcolo automatico di:
  - Potenza di picco (Pmax)
  - Consumo annuo totale
  - Profilo orario (8760 valori)
- Gestione errori con feedback visivo
- Validazione formato CSV

**UI:**
- Dropzone interattiva con feedback visivo
- Status indicators (success/error)
- Info box con formato CSV richiesto

### 2. TechConfigurator Component (`/src/components/TechConfigurator.tsx`)
**Funzionalità:**
- Toggle on/off per 4 tecnologie:
  - **Fotovoltaico**: Potenza kWp, costo €/kWp
  - **BESS**: Capacità kWh, potenza kW, costo €/kWh
  - **Pompa di Calore**: Potenza termica kW, COP, costo totale
  - **LED Relamping**: Potenze vecchie/nuove, ore funzionamento
- Parametri completamente modificabili
- UI responsive con cards collapsibili

**Validazione:**
- Tutti i valori numerici validati
- Parametri persistenti nello store Zustand

### 3. EconomicParameters Component (`/src/components/EconomicParameters.tsx`)
**Funzionalità:**
- Configurazione prezzi energia:
  - Elettricità (€/kWh)
  - Immissione rete (€/kWh)
  - Gas (€/Sm³)
  - Gasolio (€/L)
- Parametri finanziari:
  - Tasso di sconto (%)
  - Inflazione (%)
  - O&M (% CAPEX)
  - Anni di analisi
- Info box esplicative per ogni parametro

### 4. FinancialDashboard Component (`/src/components/FinancialDashboard.tsx`)
**Funzionalità:**
- **4 KPI Cards**:
  - Investimento totale (CAPEX breakdown)
  - Payback Period (semplice e attualizzato)
  - VAN e TIR
  - CO₂ evitata e alberi equivalenti

- **Metriche Energetiche**:
  - Produzione FV annua (kWh)
  - Tasso di autoconsumo (%)
  - Tasso di autosufficienza (%)

- **Grafici Interattivi (Recharts)**:
  - Area Chart: Cash Flow cumulativo (20 anni)
  - Line Chart: Bilancio energetico giornaliero
  - Tooltip e Legend interattivi

- **Tabella Conto Economico**:
  - Primi 10 anni dettagliati
  - Colonne: Ricavi, EBITDA, EBIT, Utile Netto, Cash Flow
  - Formattazione valuta italiana

### 5. Energy Calculator Engine (`/src/lib/energy-calculator.ts`)
**Funzionalità Core:**

#### a) Generazione Profilo FV
```typescript
generatePVProfile(peakPowerKwp, latitude)
```
- Modello sinusoidale con variazione stagionale
- 1200 ore equivalenti/anno (Italia)
- Output: array 8760 valori orari

#### b) Calcolo Consumo PdC
```typescript
calculateHeatPumpConsumption(thermalData, cop)
```
- Conversione energia termica → elettrica
- Formula: E_el = (E_th × η_caldaia) / COP
- Profilo stagionale (picco inverno)

#### c) Simulazione Bilancio Energetico
```typescript
simulateEnergyBalance(consumption, pv, battery...)
```
- Logica priorità:
  1. Autoconsumo diretto
  2. Carica batteria
  3. Immissione rete
  4. Scarica batteria (se deficit)
  5. Prelievo rete
- Gestione SOC batteria con efficienza round-trip
- Output: bilancio ora per ora (8760)

#### d) Analisi Finanziaria
```typescript
calculateFinancialResults(energyBalance, capex, params)
```
- Conto economico anno per anno:
  - Ricavi (risparmi + immissione)
  - Costi O&M
  - Margine lordo, EBITDA, EBIT
  - Tasse (24%)
  - Utile netto
  - Cash Flow e CF cumulativo
- Inflazione applicata ai prezzi energia

#### e) Calcolo KPI
```typescript
calculateFinancialKPIs(financialResults, capex, discountRate)
```
- **NPV**: Valore Attuale Netto
- **IRR**: Tasso Interno di Rendimento (Newton-Raphson)
- **Payback**: Semplice e attualizzato

### 6. State Management (`/src/store/useEnergyStore.ts`)
**Store Zustand con:**
- POD data (array di profili)
- Thermal data (optional)
- Tech configuration
- Economic parameters
- Simulation results

**Actions:**
- `setPODData()`
- `setThermalData()`
- `updateTechConfig()`
- `updateEconomicParams()`
- `runSimulation()`
- `reset()`

### 7. Type System (`/src/lib/types.ts`)
**Interfacce TypeScript complete:**
- `PODData`, `ThermalData`
- `TechnologyConfig` (nested per ogni tech)
- `EnergyBalance` (bilancio orario)
- `EconomicParameters`
- `FinancialYear` (risultati annuali)
- `ProjectResults` (output completo)
- `SimulationInput`

### 8. Utility Functions (`/src/lib/utils.ts`)
- `formatCurrency()`: formattazione Euro
- `formatNumber()`: separatori migliaia
- `formatPercentage()`: formattazione %
- `cn()`: utility Tailwind merge

## UI/UX Features

### Navigazione a Tab
- 4 sezioni principali: Dati, Configurazione, Parametri Economici, Risultati
- Indicatore visivo tab attiva
- Transizioni fluide

### Design System
- **Colori**: Palette professionale blu/verde
- **Icone**: Lucide React (consistenza visiva)
- **Cards**: Bordered con hover states
- **Inputs**: Focus states con ring blu
- **Buttons**: Gradient con stati disabled
- **Responsive**: Mobile-first con breakpoints MD/LG

### Feedback Utente
- Loading states durante simulazione
- Alert di errore/successo per upload
- Info boxes con istruzioni
- Tooltip su grafici
- Validazione input real-time

## Formule Energetiche Implementate

### 1. Elettrificazione Termica
```
E_elettrica [kWh] = (Consumo_combustibile × Potere_calorifico × η_caldaia) / COP

Dove:
- Gas: 1 Sm³ = 10.7 kWh termici
- Gasolio: 1 L = 10 kWh termici
- η_caldaia = 0.85 (modificabile)
- COP = 3.0 (modificabile)
```

### 2. Risparmio LED
```
Risparmio [kWh/anno] = (P_vecchia - P_LED) × Ore_funzionamento
```

### 3. Bilancio Energetico Orario
```
Surplus/Deficit = Produzione_FV - Consumo_totale

Se Surplus > 0:
  - Autoconsumo_diretto = Consumo
  - Carica_batteria = min(Surplus, P_batteria, SOC_disponibile) × η
  - Immissione_rete = resto

Se Deficit < 0:
  - Autoconsumo_diretto = Produzione_FV
  - Scarica_batteria = min(|Deficit|, P_batteria, SOC_attuale)
  - Prelievo_rete = resto
```

### 4. Impatto Ambientale
```
CO₂_evitata [ton] = Produzione_FV [kWh] × 0.3 [kg/kWh] / 1000

Alberi_equivalenti = CO₂_evitata × 1000 / 20 [kg/albero/anno]
```

### 5. Metriche Energetiche
```
Autoconsumo [%] = (Energia_autoconsumata / Produzione_FV) × 100

Autosufficienza [%] = (Energia_autoconsumata / Consumo_totale) × 100

Grid_reduction [%] = ((Consumo_baseline - Grid_import) / Consumo_baseline) × 100
```

### 6. KPI Finanziari
```
NPV = -CAPEX + Σ(CF_anno_i / (1 + r)^i)

IRR: risolve NPV = 0 con metodo Newton-Raphson

Payback_semplice: primo anno dove CF_cumulativo ≥ 0

Payback_attualizzato: primo anno dove NPV ≥ 0
```

## Parametri Default

### Tecnologie
- FV: 100 kWp @ 1000 €/kWp
- BESS: 50 kWh @ 600 €/kWh, 50 kW, η=0.9
- PdC: 50 kW, COP=3.0, 15000 €
- LED: 20→10 kW, 3000 h/anno

### Economici
- Elettricità: 0.25 €/kWh
- Immissione: 0.10 €/kWh
- Gas: 1.0 €/Sm³
- Gasolio: 1.5 €/L
- Sconto: 5%
- Inflazione: 2%
- O&M: 1.5% CAPEX
- Analisi: 20 anni

## File di Esempio Forniti

### example_pod_data.csv
CSV di test con 24 ore di dati:
- Profilo tipico C&I
- Picco giornaliero ~52 kW
- Pattern realistico (basso notturno, alto diurno)

## Performance & Ottimizzazioni

- **Build Size**: Ottimizzato con Next.js 16 + Turbopack
- **Rendering**: Server Components dove possibile
- **State**: Zustand (lightweight, ~1KB)
- **Charts**: Recharts con lazy loading
- **TypeScript**: Strict mode, zero errors
- **Responsive**: Mobile-first, breakpoints ottimizzati

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Limitazioni Correnti
1. Profilo FV semplificato (non usa API PVGIS)
2. No upload PDF (solo CSV)
3. No export risultati (PDF/Excel)
4. No incentivi fiscali configurabili
5. No database / persistenza progetti
6. Batteria: nessun modello di degrado

## Possibili Estensioni
- Integrazione PVGIS per profili FV reali
- OCR per parsing PDF bollette
- Export PDF report professionali
- Configurazione incentivi (Transizione 5.0, CER)
- Multi-scenario analysis
- Database PostgreSQL + autenticazione
- API REST per integrazioni esterne
- Modello degradazione batteria nel tempo
