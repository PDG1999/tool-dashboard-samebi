import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  AlertTriangle,
  PieChart,
  Activity
} from 'lucide-react';
import { DashboardStats } from '../types/dashboard';
import { mockDashboardStats, mockTestResults, mockClients } from '../data/mockData';
import { exportToExcel, exportClientList, generateReport } from '../utils/export';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const stats = mockDashboardStats;

  const ChartCard = ({ 
    title, 
    children, 
    icon: Icon 
  }: { 
    title: string; 
    children: React.ReactNode; 
    icon: React.ComponentType<any>; 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      {children}
    </div>
  );

  const SimpleBarChart = ({ data, color = 'bg-samebi-600' }: { data: { label: string; value: number; max?: number }[]; color?: string }) => {
    const maxValue = Math.max(...data.map(d => d.max || d.value));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.max || item.value) / maxValue) * 100;
          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 w-20">{item.label}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${color} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChart = ({ data, colors }: { data: { label: string; value: number; color: string }[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const LineChart = ({ data }: { data: { month: string; count: number }[] }) => {
    const maxCount = Math.max(...data.map(d => d.count));
    
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-32">
          {data.map((item, index) => {
            const height = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-samebi-600 rounded-t w-full max-w-8 transition-all duration-300 hover:bg-samebi-700"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                  {item.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-600">Tests pro Monat</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Berichte</h1>
          <p className="text-gray-600">Detaillierte Einblicke in Ihre Praxis-Statistiken</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent"
          >
            <option value="1month">Letzter Monat</option>
            <option value="3months">Letzte 3 Monate</option>
            <option value="6months">Letzte 6 Monate</option>
            <option value="1year">Letztes Jahr</option>
          </select>
          <button 
            onClick={() => generateReport(mockTestResults, mockClients)}
            className="bg-samebi-600 text-white px-4 py-2 rounded-lg hover:bg-samebi-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Bericht exportieren
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gesamt-Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
              <p className="text-xs text-green-600">+12% vs. Vormonat</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Klienten</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              <p className="text-xs text-green-600">+8% vs. Vormonat</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hochrisiko</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highRiskClients}</p>
              <p className="text-xs text-red-600">+2 vs. Vormonat</p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ø Risiko-Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRiskScore}%</p>
              <p className="text-xs text-yellow-600">+3% vs. Vormonat</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <ChartCard title="Risiko-Verteilung" icon={PieChart}>
          <PieChart 
            data={[
              { label: 'Niedrig', value: 18, color: '#10B981' },
              { label: 'Mittel', value: 14, color: '#F59E0B' },
              { label: 'Hoch', value: 8, color: '#F97316' },
              { label: 'Kritisch', value: 5, color: '#EF4444' },
            ]}
          />
        </ChartCard>

        {/* Tests Over Time */}
        <ChartCard title="Tests über Zeit" icon={TrendingUp}>
          <LineChart data={stats.testsByMonth} />
        </ChartCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Concerns */}
        <ChartCard title="Häufigste Probleme" icon={AlertTriangle}>
          <SimpleBarChart 
            data={[
              { label: 'Spielsucht', value: 35, max: 50 },
              { label: 'Alkohol', value: 28, max: 50 },
              { label: 'Digital', value: 22, max: 50 },
              { label: 'Kaufsucht', value: 15, max: 50 },
              { label: 'Substanzen', value: 8, max: 50 },
            ]}
            color="bg-red-500"
          />
        </ChartCard>

        {/* Monthly Performance */}
        <ChartCard title="Monatliche Leistung" icon={Calendar}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Diesen Monat</span>
              <span className="text-lg font-bold text-gray-900">{stats.testsThisMonth} Tests</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-samebi-600 h-2 rounded-full transition-all duration-300"
                style={{ width: '75%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Ziel: 30 Tests</span>
              <span>75% erreicht</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Berichte exportieren</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => generateReport(mockTestResults, mockClients)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <Download className="h-5 w-5 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">PDF-Bericht</span>
            </div>
            <p className="text-sm text-gray-600">Vollständiger Praxis-Bericht</p>
          </button>
          
          <button 
            onClick={() => exportToExcel(mockTestResults, mockClients)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <Download className="h-5 w-5 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">Excel-Export</span>
            </div>
            <p className="text-sm text-gray-600">Rohdaten für weitere Analyse</p>
          </button>
          
          <button 
            onClick={() => exportClientList(mockClients)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <Download className="h-5 w-5 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">Klienten-Liste</span>
            </div>
            <p className="text-sm text-gray-600">Alle Klienten mit Kontaktdaten</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
