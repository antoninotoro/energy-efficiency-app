'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Leaf } from 'lucide-react';
import { useEnergyStore } from '@/store/useEnergyStore';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

export default function FinancialDashboard() {
  const results = useEnergyStore((state) => state.results);

  if (!results) {
    return (
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Configura le tecnologie e clicca su &quot;Esegui Simulazione&quot; per vedere i risultati
        </p>
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
    consumption: hour.consumption.toFixed(2),
    production: hour.pvProduction.toFixed(2),
    battery: hour.batterySOC.toFixed(1),
  }));

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Risultati</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CAPEX */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-600">Investimento Totale</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.capex.total)}</p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            {results.capex.photovoltaic > 0 && (
              <div>FV: {formatCurrency(results.capex.photovoltaic)}</div>
            )}
            {results.capex.battery > 0 && (
              <div>Batteria: {formatCurrency(results.capex.battery)}</div>
            )}
            {results.capex.heatPump > 0 && (
              <div>PdC: {formatCurrency(results.capex.heatPump)}</div>
            )}
          </div>
        </div>

        {/* Payback */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-600">Payback Period</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {results.financialMetrics.simplePayback.toFixed(1)} anni
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Attualizzato: {results.financialMetrics.discountedPayback.toFixed(1)} anni
          </p>
        </div>

        {/* NPV */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-600">VAN (NPV)</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(results.financialMetrics.npv)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            TIR: {formatPercentage(results.financialMetrics.irr)}
          </p>
        </div>

        {/* Impatto Ambientale */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-600">CO₂ Evitata</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(results.energyMetrics.co2AvoidedTonnes, 1)} ton/anno
          </p>
          <p className="mt-1 text-sm text-gray-500">
            ≈ {formatNumber(results.energyMetrics.equivalentTrees, 0)} alberi
          </p>
        </div>
      </div>

      {/* Metriche Energetiche */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Metriche Energetiche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Produzione FV Annua</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(results.energyMetrics.annualPvProduction, 0)} kWh
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Autoconsumo</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPercentage(results.energyMetrics.selfConsumptionRate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Autosufficienza</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPercentage(results.energyMetrics.selfSufficiencyRate)}
            </p>
          </div>
        </div>
      </div>

      {/* Grafico Cash Flow */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Flusso di Cassa Cumulativo (20 anni)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Anno', position: 'insideBottom', offset: -5 }} />
            <YAxis
              label={{ value: 'Euro (€)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
              labelFormatter={(label) => `Anno ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulativeCashFlow"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Cash Flow Cumulativo"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grafico Bilancio Energetico Giornaliero */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Bilancio Energetico (Giorno Tipo)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={energyBalanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: 'Ora', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#ef4444"
              strokeWidth={2}
              name="Consumo"
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#eab308"
              strokeWidth={2}
              name="Produzione FV"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabella Conto Economico (primi 10 anni) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Conto Economico (Primi 10 Anni)
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Anno
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ricavi
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                EBITDA
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                EBIT
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Utile Netto
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Cash Flow
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.yearlyResults.slice(0, 10).map((year) => (
              <tr key={year.year} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{year.year}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(year.totalRevenue)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(year.ebitda)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(year.ebit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(year.netIncome)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600">
                  {formatCurrency(year.cashFlow)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
