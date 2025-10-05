import React from 'react';
import { BarChart3, Users, FileText, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { DashboardStats } from '../types/dashboard';
import { mockDashboardStats } from '../data/mockData';
import QuickActions from './QuickActions';

const DashboardOverview: React.FC = () => {
  const stats = mockDashboardStats;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<any>; 
    color: string; 
    subtitle?: string; 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const RecentTest = ({ 
    name, 
    date, 
    concern, 
    riskLevel 
  }: { 
    name: string; 
    date: string; 
    concern: string; 
    riskLevel: string; 
  }) => {
    const getRiskColor = (level: string) => {
      switch (level) {
        case 'Kritisch': return 'text-red-600 bg-red-100';
        case 'Hoch': return 'text-orange-600 bg-orange-100';
        case 'Mittel': return 'text-yellow-600 bg-yellow-100';
        case 'Niedrig': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{date} • {concern}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
          {riskLevel}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Berater-Dashboard</h1>
          <p className="text-gray-600">Willkommen zurück, Dr. Schmidt</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-samebi-600 text-white px-4 py-2 rounded-lg hover:bg-samebi-700 transition-colors">
            Neuer Test
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Aktive Klienten"
          value={stats.totalClients}
          icon={Users}
          color="bg-blue-500"
          subtitle="Gesamt"
        />
        <StatCard
          title="Tests durchgeführt"
          value={stats.totalTests}
          icon={FileText}
          color="bg-green-500"
          subtitle="Alle Zeiten"
        />
        <StatCard
          title="Diesen Monat"
          value={stats.testsThisMonth}
          icon={Calendar}
          color="bg-purple-500"
          subtitle="Neue Tests"
        />
        <StatCard
          title="Hochrisiko-Klienten"
          value={stats.highRiskClients}
          icon={AlertTriangle}
          color="bg-red-500"
          subtitle="Sofortige Aufmerksamkeit"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onNewClient={() => console.log('New client')}
        onNewTest={() => console.log('New test')}
        onExport={() => console.log('Export')}
        onSchedule={() => console.log('Schedule')}
        onViewClients={() => console.log('View clients')}
        onViewAnalytics={() => console.log('View analytics')}
        urgentTasks={3}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risiko-Verteilung</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.riskDistribution.map((item, index) => {
              const percentage = (item.count / stats.totalClients) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{item.level}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-samebi-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Neueste Tests</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-1">
            <RecentTest
              name="Maria S."
              date="15.01.24"
              concern="Spielsucht"
              riskLevel="Kritisch"
            />
            <RecentTest
              name="Thomas K."
              date="14.01.24"
              concern="Alkohol"
              riskLevel="Mittel"
            />
            <RecentTest
              name="Anna M."
              date="13.01.24"
              concern="Keine"
              riskLevel="Niedrig"
            />
            <RecentTest
              name="Peter W."
              date="12.01.24"
              concern="Spielsucht"
              riskLevel="Kritisch"
            />
          </div>
        </div>
      </div>

      {/* Follow-ups Required */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Follow-ups erforderlich</h3>
            <p className="text-yellow-700">
              3 Klienten benötigen Nachfrage • 1 Termin überfällig (Maria S.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
