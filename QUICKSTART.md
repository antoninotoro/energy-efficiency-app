# Quick Start Guide - Energy Efficiency Platform

## Avvio Rapido (3 minuti)

### 1. Installazione
```bash
cd /Users/tony/energy-efficiency-app
npm install
```

### 2. Avvia Development Server
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

### 3. Test con Dati di Esempio

#### Step 1: Carica CSV
- Vai alla tab "Dati"
- Trascina il file `example_pod_data.csv` (fornito nella root)
- Attendi conferma upload

#### Step 2: Configura Tecnologie
- Vai alla tab "Configurazione"
- **Attiva Fotovoltaico**:
  - Potenza: 100 kWp
  - Costo: 1000 €/kWp
- **Attiva Batteria** (opzionale):
  - Capacità: 50 kWh
  - Potenza: 50 kW
  - Costo: 600 €/kWh

#### Step 3: Parametri Economici (opzionale)
- Vai alla tab "Parametri Economici"
- Valori default già impostati:
  - Elettricità: 0.25 €/kWh
  - Immissione: 0.10 €/kWh
  - Tasso sconto: 5%
  - Inflazione: 2%

#### Step 4: Esegui Simulazione
- Clicca il pulsante "Esegui Simulazione" in alto a destra
- Attendi elaborazione (~1 secondo)
- Vieni reindirizzato automaticamente alla tab "Risultati"

#### Step 5: Analizza Risultati
Visualizzerai:
- **KPI Cards**: CAPEX, Payback, NPV, IRR, CO₂
- **Metriche Energetiche**: Produzione FV, Autoconsumo, Autosufficienza
- **Grafico Cash Flow**: Andamento finanziario 20 anni
- **Grafico Energetico**: Bilancio giorno tipo
- **Tabella Economica**: Conto economico dettagliato

## Scenario di Test Realistici

### Scenario 1: Solo Fotovoltaico
```
- Carica: example_pod_data.csv
- Attiva: Fotovoltaico (100 kWp)
- Disattiva: tutto il resto
- Risultato atteso:
  * Payback ~7-8 anni
  * NPV positivo
  * Autoconsumo ~30-40%
```

### Scenario 2: FV + Batteria
```
- Carica: example_pod_data.csv
- Attiva: Fotovoltaico (100 kWp) + Batteria (50 kWh)
- Risultato atteso:
  * Payback ~9-10 anni
  * Autoconsumo ~60-70%
  * Autosufficienza aumentata
```

### Scenario 3: Intervento Completo
```
- Carica: example_pod_data.csv
- Attiva TUTTO:
  * FV: 100 kWp
  * BESS: 50 kWh
  * PdC: 50 kW termici (COP 3.0)
  * LED: 20→10 kW, 3000h/anno
- Risultato atteso:
  * CAPEX ~150-200k€
  * Payback ~10-12 anni
  * Massimo risparmio energetico
```

## Creazione CSV Personalizzato

### Formato Richiesto
```csv
timestamp,power_kw
2024-01-01 00:00:00,15.5
2024-01-01 01:00:00,14.2
...
```

### Generazione Automatica (Python)
```python
import pandas as pd
import numpy as np

# Crea 8760 ore (1 anno)
hours = pd.date_range('2024-01-01', periods=8760, freq='H')

# Profilo base con pattern giornaliero
base_load = 20  # kW
daily_pattern = np.sin(np.arange(8760) * 2 * np.pi / 24) * 10
noise = np.random.normal(0, 2, 8760)

power_kw = base_load + daily_pattern + noise
power_kw = np.maximum(power_kw, 5)  # minimo 5 kW

df = pd.DataFrame({
    'timestamp': hours,
    'power_kw': power_kw
})

df.to_csv('my_profile.csv', index=False)
```

### Generazione Manuale (Excel)
1. Colonna A: timestamp (formato: YYYY-MM-DD HH:MM:SS)
2. Colonna B: power_kw (valori numerici)
3. Salva come CSV UTF-8

## Comandi Utili

### Development
```bash
npm run dev        # Avvia server sviluppo
npm run build      # Build produzione
npm run start      # Avvia server produzione
npm run lint       # Controlla errori ESLint
```

### Port Personalizzata
```bash
npm run dev -- -p 3001
```

### Debug
```bash
# Apri DevTools browser
# Console → visualizza eventuali errori
# Network → monitora caricamento file
```

## Troubleshooting

### Errore: "Nessun dato POD disponibile"
**Causa**: CSV non caricato correttamente
**Soluzione**:
- Verifica formato CSV (header corretto)
- Controlla che ci siano valori numerici validi
- Ricarica il file

### Errore: Build fallito
**Causa**: Dipendenze mancanti
**Soluzione**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Warning: Multiple lockfiles
**Soluzione**: Già risolto con `next.config.js`
Ignora il warning se persiste.

### Grafici non visualizzati
**Causa**: Dati non sufficienti
**Soluzione**:
- Verifica che la simulazione sia stata eseguita
- Controlla che ci siano almeno 24 ore di dati

## Personalizzazione Parametri

### Modificare Default Tecnologie
File: `/src/store/useEnergyStore.ts`

```typescript
const defaultTechConfig: TechnologyConfig = {
  photovoltaic: {
    enabled: true,
    peakPowerKwp: 100,  // ← Modifica qui
    unitCostEuroPerKwp: 1000,  // ← Modifica qui
    ...
  },
  ...
}
```

### Modificare Default Economici
Stesso file, sezione:
```typescript
const defaultEconomicParams: EconomicParameters = {
  electricityPriceEuroPerKwh: 0.25,  // ← Modifica qui
  discountRate: 5.0,  // ← Modifica qui
  ...
}
```

### Modificare Costanti Calcolo
File: `/src/lib/energy-calculator.ts`

```typescript
const HOURS_PER_YEAR = 8760;
const CO2_KG_PER_KWH = 0.3;  // ← Modifica qui
const CO2_KG_PER_TREE = 20;  // ← Modifica qui
```

## Best Practices

### Dati Input
- Usa profili orari completi (8760 valori ideale)
- Verifica che i picchi siano realistici
- Controlla che non ci siano valori negativi

### Dimensionamento
- FV: tipicamente 20-30% del picco di carico
- BESS: 0.5-1.0 ore di capacità rispetto al picco
- PdC: dimensiona in base al fabbisogno termico reale
- LED: considera solo se ci sono luci on 24/7 o molte ore/giorno

### Analisi Risultati
- Payback <10 anni → progetto interessante
- IRR >8% → rendimento attraente
- Autoconsumo >50% → FV ben dimensionato
- NPV positivo → progetto economicamente sostenibile

## Contatti & Supporto

Per domande o segnalazioni:
- Apri issue su GitHub (se disponibile)
- Consulta `FEATURES.md` per dettagli tecnici
- Leggi `README.md` per documentazione completa

## Next Steps

Dopo aver testato con i dati di esempio:
1. Carica i tuoi dati reali di consumo
2. Fine-tune i parametri tecnologici
3. Testa diversi scenari
4. Esporta/stampa i risultati (screenshot per ora)
5. Usa i KPI per decisioni di investimento

Buon lavoro! 🚀⚡
