# Energy Efficiency Platform - C&I / B2G

Web Application professionale per il dimensionamento preliminare di interventi energetici integrati nel settore Commerciale & Industriale (C&I) e Pubblica Amministrazione (B2G).

## Funzionalità Principali

### Tecnologie Supportate
- **Fotovoltaico (FV)**: Dimensionamento impianto con calcolo produzione annua
- **Sistema di Accumulo (BESS)**: Batterie per massimizzare l'autoconsumo
- **Pompa di Calore (PdC)**: Elettrificazione dei consumi termici
- **Relamping LED**: Efficientamento illuminazione

### Analisi Economica
- Calcolo CAPEX per ciascuna tecnologia
- Conto economico dettagliato (20 anni)
- KPI finanziari: NPV, IRR, Payback Period
- Analisi impatto ambientale (CO₂ evitata)

### Simulazione Energetica
- Bilancio energetico orario con gestione batteria
- Calcolo autoconsumo e autosufficienza
- Curve di carico interattive
- Profilo produzione fotovoltaica

## Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript, Tailwind CSS v4
- **Grafici**: Recharts
- **State Management**: Zustand
- **File Processing**: PapaParse (CSV)
- **Icons**: Lucide React

## Installazione

```bash
npm install
```

## Avvio Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Build Produzione

```bash
npm run build
npm start
```

## Struttura Progetto

```
src/
├── app/
│   ├── globals.css          # Stili globali Tailwind
│   ├── layout.tsx            # Layout principale
│   └── page.tsx              # Home page con navigazione
├── components/
│   ├── DataImporter.tsx      # Upload e parsing CSV
│   ├── TechConfigurator.tsx  # Configurazione tecnologie
│   └── FinancialDashboard.tsx # Risultati e grafici
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── energy-calculator.ts  # Engine di calcolo energetico
│   └── utils.ts              # Utility functions
└── store/
    └── useEnergyStore.ts     # Store Zustand globale
```

## Utilizzo

### 1. Carica Dati Energetici

Nella tab "Dati", carica uno o più file CSV con il formato:

```csv
timestamp,power_kw
2024-01-01 00:00:00,25.5
2024-01-01 01:00:00,23.2
2024-01-01 02:00:00,21.8
...
```

Il sistema:
- Calcola automaticamente la potenza di picco (Pmax)
- Determina il consumo annuo totale
- Crea il profilo orario (8760 valori)

### 2. Configura Tecnologie

Nella tab "Configurazione":
- Attiva/disattiva ciascuna tecnologia tramite toggle
- Modifica i parametri tecnici (kWp, kWh, COP, etc.)
- Personalizza i costi unitari (€/kWp, €/kWh)

#### Parametri Modificabili:

**Fotovoltaico:**
- Potenza di picco (kWp)
- Costo unitario (€/kWp) - default 1000 €/kWp

**Batteria:**
- Capacità (kWh)
- Potenza (kW)
- Costo (€/kWh) - default 600 €/kWh

**Pompa di Calore:**
- Potenza termica (kW)
- COP (Coefficient of Performance) - default 3.0
- Costo totale (€)

**LED Relamping:**
- Potenza vecchia (kW)
- Potenza nuova LED (kW)
- Ore di funzionamento annue

### 3. Esegui Simulazione

Clicca su "Esegui Simulazione" per:
- Calcolare il bilancio energetico orario
- Simulare il comportamento della batteria
- Generare i risultati economici

### 4. Visualizza Risultati

Nella tab "Risultati":

**KPI Cards:**
- Investimento totale (CAPEX)
- Payback Period (semplice e attualizzato)
- VAN (NPV) e TIR (IRR)
- CO₂ evitata e alberi equivalenti

**Grafici Interattivi:**
- Cash Flow cumulativo (20 anni)
- Bilancio energetico giornaliero tipo
- Tabella conto economico dettagliata

## Logica di Calcolo

### Simulazione Fotovoltaico

Profilo di produzione basato su:
- Modello sinusoidale giornaliero
- Variazione stagionale (più produzione in estate)
- 1200 ore equivalenti/anno (Italia centrale)

### Gestione Batteria

Strategia di priorità:
1. **Autoconsumo diretto** da FV
2. **Carica batteria** con surplus FV
3. **Immissione in rete** se batteria piena
4. **Scarica batteria** in caso di deficit
5. **Prelievo da rete** come ultima opzione

### Elettrificazione Termica

Formula: `E_elettrica = (E_termica × η_caldaia) / COP`

Conversioni:
- 1 Sm³ gas = ~10.7 kWh termici
- 1 L gasolio = ~10 kWh termici

### Analisi Finanziaria

**Conto Economico (per anno):**
- Ricavi totali (risparmi + incentivi)
- Costi O&M (1.5% CAPEX)
- EBITDA, EBIT, Utile Netto
- Cash Flow e CF cumulativo

**KPI Finanziari:**
- **NPV**: Valore Attuale Netto con tasso di sconto 5%
- **IRR**: Tasso Interno di Rendimento (Newton-Raphson)
- **Payback**: Tempo di recupero investimento

## Parametri Economici Default

Modificabili nello store `/src/store/useEnergyStore.ts`:

```typescript
electricityPriceEuroPerKwh: 0.25 €/kWh
gasPriceEuroPerSm3: 1.0 €/Sm³
dieselPriceEuroPerLiter: 1.5 €/L
gridExportPriceEuroPerKwh: 0.10 €/kWh
discountRate: 5.0%
analysisYears: 20
inflationRate: 2.0%
omCostPercentage: 1.5%
```

## Esempio CSV Test

Crea un file `test_pod.csv`:

```csv
timestamp,power_kw
2024-01-01 00:00:00,15.5
2024-01-01 01:00:00,14.2
2024-01-01 02:00:00,13.8
2024-01-01 03:00:00,13.5
2024-01-01 04:00:00,13.2
2024-01-01 05:00:00,14.5
2024-01-01 06:00:00,18.2
2024-01-01 07:00:00,25.8
2024-01-01 08:00:00,35.2
2024-01-01 09:00:00,42.5
2024-01-01 10:00:00,48.3
2024-01-01 11:00:00,52.1
2024-01-01 12:00:00,50.8
2024-01-01 13:00:00,49.2
2024-01-01 14:00:00,51.5
2024-01-01 15:00:00,48.7
2024-01-01 16:00:00,45.2
2024-01-01 17:00:00,38.5
2024-01-01 18:00:00,32.1
2024-01-01 19:00:00,28.5
2024-01-01 20:00:00,25.2
2024-01-01 21:00:00,22.8
2024-01-01 22:00:00,19.5
2024-01-01 23:00:00,17.2
```

Ripeti per 8760 ore o l'algoritmo estenderà automaticamente i valori.

## Prossimi Sviluppi

- [ ] Integrazione API PVGIS per profili FV realistici
- [ ] Upload e parsing PDF bollette (Tesseract.js)
- [ ] Export risultati in PDF/Excel
- [ ] Configurazione incentivi fiscali (es. Transizione 5.0)
- [ ] Multi-scenario analysis
- [ ] Integrazione database per salvare progetti

## Licenza

MIT

## Autore

Sviluppato con Next.js, React e TypeScript per il settore energy C&I / B2G.
