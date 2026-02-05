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
      <div className="max-w-5xl">
        <div className="card p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-6">
            <BarChart3 className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Nessun Risultato Disponibile</h3>
          <p className="text-slate-600">
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CAPEX Card */}
        <div className="card p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Investimento</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-3">{formatCurrency(results.capex.total)}</p>
          <div className="space-y-1.5 pt-3 border-t border-slate-200">
            {results.capex.photovoltaic > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  FV
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(results.capex.photovoltaic)}</span>
              </div>
            )}
            {results.capex.battery > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Battery className="h-3.5 w-3.5 text-emerald-500" />
                  BESS
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(results.capex.battery)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payback Card */}
        <div className="card p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Payback</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-3">
            {results.financialMetrics.simplePayback.toFixed(1)} <span className="text-lg text-slate-600">anni</span>
          </p>
          <div className="space-y-1.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Semplice</span>
              <span className="font-semibold text-emerald-600">{results.financialMetrics.simplePayback.toFixed(1)} anni</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Attualizzato</span>
              <span className="font-semibold text-slate-900">{results.financialMetrics.discountedPayback.toFixed(1)} anni</span>
            </div>
          </div>
        </div>

        {/* NPV Card */}
        <div className="card p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">VAN (NPV)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-3">
            {formatCurrency(results.financialMetrics.npv)}
          </p>
          <div className="space-y-1.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">TIR (IRR)</span>
              <span className="font-semibold text-purple-600">{formatPercentage(results.financialMetrics.irr)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Orizzonte</span>
              <span className="font-semibold text-slate-900">20 anni</span>
            </div>
          </div>
        </div>

        {/* CO2 Card */}
        <div className="card p-5 card-hover">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">CO₂ Evitata</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-3">
            {formatNumber(results.energyMetrics.co2AvoidedTonnes, 1)} <span className="text-lg text-slate-600">t/anno</span>
          </p>
          <div className="space-y-1.5 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Alberi equiv.</span>
              <span className="font-semibold text-emerald-600">{formatNumber(results.energyMetrics.equivalentTrees, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metriche Energetiche */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Metriche Energetiche</h3>
            <p className="text-xs text-slate-500">Performance impianto fotovoltaico</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-semibold">Produzione FV Annua</p>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {formatNumber(results.energyMetrics.annualPvProduction, 0)}
            </p>
            <p className="text-sm text-slate-600">kWh</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-semibold">Autoconsumo</p>
            <p className="text-2xl font-bold text-emerald-600 mb-1">
              {formatPercentage(results.energyMetrics.selfConsumptionRate, 0)}
            </p>
            <p className="text-sm text-slate-600">della produzione</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wide font-semibold">Autosufficienza</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {formatPercentage(results.energyMetrics.selfSufficiencyRate, 0)}
            </p>
            <p className="text-sm text-slate-600">del consumo</p>
          </div>
        </div>
      </div>

      {/* Grafico Cash Flow */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Flusso di Cassa Cumulativo (20 anni)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData}>
            <defs>
              <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '13px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
              labelFormatter={(label) => `Anno ${label}`}
              labelStyle={{ color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}
            />
            <Area
              type="monotone"
              dataKey="cumulativeCashFlow"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#colorCashFlow)"
              name="Cash Flow Cumulativo"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grafico Bilancio Energetico */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-600" />
          Bilancio Energetico (Giorno Tipo)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={energyBalanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '13px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}
            />
            <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
              name="Consumo"
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#eab308"
              strokeWidth={2.5}
              dot={false}
              name="Produzione FV"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabella Conto Economico - Scrollabile */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Conto Economico (Primi 10 Anni)
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Anno
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Ricavi
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  EBITDA
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  EBIT
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Utile Netto
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Cash Flow
                </th>
              </tr>
            </thead>
            <tbody>
              {results.yearlyResults.slice(0, 10).map((year) => (
                <tr
                  key={year.year}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-bold text-slate-900">{year.year}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">{formatCurrency(year.totalRevenue)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">{formatCurrency(year.ebitda)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">{formatCurrency(year.ebit)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <span className="font-semibold text-slate-900">{formatCurrency(year.netIncome)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right">
                    <span className="font-bold text-emerald-600">{formatCurrency(year.cashFlow)}</span>
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
