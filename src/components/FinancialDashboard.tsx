'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Leaf, BarChart3, Zap, Battery, Sun } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

export default function FinancialDashboard() {
  const results = useEnergyStore((state) => state.results);

  if (!results) {
    return (
      <div className="space-y-8">
        <div className="card p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Nessun Risultato Disponibile</h3>
          <p className="text-gray-600 text-lg">
            Configura le tecnologie e clicca su &quot;Esegui Simulazione&quot; per vedere i risultati
          </p>
        </div>
      </div>
    );
  }

  // Prepara dati per i grafici
  const cashFlowData = results.yearlyResults.map((year) => ({
    year: year.year,
    cashFlow: Math.round(year.cashFlow),
    cumulativeCashFlow: Math.round(year.cumulativeCashFlow),
  }));

  // Dati per grafico bilancio energetico (prime 24 ore come esempio)
  const energyBalanceData = results.energyBalance.slice(0, 24).map((hour) => ({
    hour: hour.hour,
    consumption: parseFloat(hour.consumption.toFixed(2)),
    production: parseFloat(hour.pvProduction.toFixed(2)),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="section-header">
        <div className="icon-box bg-gradient-green">
          <BarChart3 className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Risultati</h2>
          <p className="text-gray-600">Analisi economica e KPI del progetto</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CAPEX Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-box bg-gradient-blue" style={{ width: '48px', height: '48px' }}>
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Investimento</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">{formatCurrency(results.capex.total)}</p>
          <div className="space-y-2 pt-3 border-t-2 border-gray-200">
            {results.capex.photovoltaic > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  FV
                </span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.capex.photovoltaic)}</span>
              </div>
            )}
            {results.capex.battery > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-500" />
                  BESS
                </span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.capex.battery)}</span>
              </div>
            )}
            {results.capex.heatPump > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">PdC</span>
                <span className="font-semibold text-gray-900">{formatCurrency(results.capex.heatPump)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payback Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-box bg-gradient-green" style={{ width: '48px', height: '48px' }}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Payback</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {results.financialMetrics.simplePayback.toFixed(1)} <span className="text-xl text-gray-600">anni</span>
          </p>
          <div className="space-y-2 pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Semplice</span>
              <span className="font-semibold text-green-600">{results.financialMetrics.simplePayback.toFixed(1)} anni</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Attualizzato</span>
              <span className="font-semibold text-gray-900">{results.financialMetrics.discountedPayback.toFixed(1)} anni</span>
            </div>
          </div>
        </div>

        {/* NPV Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-box bg-gradient-purple" style={{ width: '48px', height: '48px' }}>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">VAN (NPV)</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {formatCurrency(results.financialMetrics.npv)}
          </p>
          <div className="space-y-2 pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">TIR (IRR)</span>
              <span className="font-semibold text-purple-600">{formatPercentage(results.financialMetrics.irr)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Orizzonte</span>
              <span className="font-semibold text-gray-900">20 anni</span>
            </div>
          </div>
        </div>

        {/* CO2 Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-box bg-gradient-green" style={{ width: '48px', height: '48px' }}>
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">CO₂ Evitata</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {formatNumber(results.energyMetrics.co2AvoidedTonnes, 1)} <span className="text-xl text-gray-600">ton/anno</span>
          </p>
          <div className="space-y-2 pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Alberi equivalenti</span>
              <span className="font-semibold text-green-600">{formatNumber(results.energyMetrics.equivalentTrees, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metriche Energetiche */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box bg-gradient-orange">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Metriche Energetiche</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-section text-center">
            <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-semibold">Produzione FV Annua</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(results.energyMetrics.annualPvProduction, 0)}
            </p>
            <p className="text-base text-gray-600">kWh</p>
          </div>
          <div className="form-section text-center">
            <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-semibold">Autoconsumo</p>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {formatPercentage(results.energyMetrics.selfConsumptionRate, 0)}
            </p>
            <p className="text-base text-gray-600">della produzione</p>
          </div>
          <div className="form-section text-center">
            <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide font-semibold">Autosufficienza</p>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {formatPercentage(results.energyMetrics.selfSufficiencyRate, 0)}
            </p>
            <p className="text-base text-gray-600">del consumo</p>
          </div>
        </div>
      </div>

      {/* Grafico Cash Flow */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-green-600" />
          Flusso di Cassa Cumulativo (20 anni)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={cashFlowData}>
            <defs>
              <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              style={{ fontSize: '14px', fontWeight: 600 }}
              label={{ value: 'Anno', position: 'insideBottom', offset: -5, fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '14px', fontWeight: 600 }}
              label={{ value: 'Euro (€)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
              labelFormatter={(label) => `Anno ${label}`}
              labelStyle={{ color: '#1e293b', fontWeight: 700, marginBottom: '8px' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeCashFlow"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorCashFlow)"
              name="Cash Flow Cumulativo"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grafico Bilancio Energetico */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-600" />
          Bilancio Energetico (Giorno Tipo)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={energyBalanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              style={{ fontSize: '14px', fontWeight: 600 }}
              label={{ value: 'Ora', position: 'insideBottom', offset: -5, fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '14px', fontWeight: 600 }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 700, marginBottom: '8px' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              name="Consumo"
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#eab308"
              strokeWidth={3}
              dot={false}
              name="Produzione FV"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabella Conto Economico */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-blue-600" />
          Conto Economico (Primi 10 Anni)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Anno
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Ricavi
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wide">
                  EBITDA
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wide">
                  EBIT
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Utile Netto
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Cash Flow
                </th>
              </tr>
            </thead>
            <tbody>
              {results.yearlyResults.slice(0, 10).map((year) => (
                <tr
                  key={year.year}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-base font-bold text-gray-900">{year.year}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-base font-semibold text-gray-900">{formatCurrency(year.totalRevenue)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-base font-semibold text-gray-900">{formatCurrency(year.ebitda)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-base font-semibold text-gray-900">{formatCurrency(year.ebit)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-base font-semibold text-gray-900">{formatCurrency(year.netIncome)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-base font-bold text-green-600">{formatCurrency(year.cashFlow)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
