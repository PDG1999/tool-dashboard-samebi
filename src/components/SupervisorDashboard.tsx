import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Eye,
  Download,
  MapPin,
  Smartphone
} from 'lucide-react';

// Mock data - wird später durch echte API-Daten ersetzt
const mockSupervisorData = {
  globalStats: {
    totalTests: 1234,
    totalCounselors: 45,
    totalClients: 892,
    avgCompletionRate: 78,
    avgTestDuration: 485,
    mostCriticalCategory: 'Spielsucht',
  },
  testsByRisk: [
    { level: 'Niedrig', count: 450, percentage: 36.5, color: 'green' },
    { level: 'Mittel', count: 380, percentage: 30.8, color: 'yellow' },
    { level: 'Hoch', count: 290, percentage: 23.5, color: 'orange' },
    { level: 'Kritisch', count: 114, percentage: 9.2, color: 'red' },
  ],
  abortAnalytics: {
    totalAborts: 267,
    abortRate: 21.6,
    criticalQuestions: [
      { questionId: 'f3_8', question: 'Wie oft spielen Sie Glücksspiele?', abortCount: 45, avgTimeBeforeAbort: 32 },
      { questionId: 'f2_4', question: 'Haben Sie jemals versucht, Ihr Verhalten zu verbergen?', abortCount: 38, avgTimeBeforeAbort: 28 },
      { questionId: 'f2_7', question: 'Wie viel Geld geben Sie aus?', abortCount: 31, avgTimeBeforeAbort: 41 },
    ],
  },
  questionMetrics: {
    avgTimePerQuestion: 12.1,
    mostDifficultQuestions: [
      { questionId: 'f3_8', avgTime: 45, changeRate: 0.32 },
      { questionId: 'f2_7', avgTime: 41, changeRate: 0.28 },
      { questionId: 'f2_4', avgTime: 38, changeRate: 0.25 },
    ],
  },
  geographicData: [
    { city: 'Berlin', tests: 245, criticalRate: 12.2 },
    { city: 'München', tests: 189, criticalRate: 8.5 },
    { city: 'Hamburg', tests: 167, criticalRate: 9.8 },
    { city: 'Köln', tests: 134, criticalRate: 11.2 },
  ],
  deviceData: [
    { type: 'Desktop', count: 645, percentage: 52.3 },
    { type: 'Mobile', count: 456, percentage: 37.0 },
    { type: 'Tablet', count: 133, percentage: 10.7 },
  ],
  counselorPerformance: [
    { name: 'Dr. Mueller', clients: 45, tests: 89, avgRisk: 42 },
    { name: 'Dr. Schmidt', clients: 38, tests: 76, avgRisk: 38 },
    { name: 'Dr. Weber', clients: 32, tests: 64, avgRisk: 51 },
  ],
};

const SupervisorDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'analytics' | 'counselors'>('overview');

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'niedrig': return 'text-green-600 bg-green-50';
      case 'mittel': return 'text-yellow-600 bg-yellow-50';
      case 'hoch': return 'text-orange-600 bg-orange-50';
      case 'kritisch': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🔍 Supervisor Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Globale Übersicht & Analytics
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  title="Zeitraum wählen"
                >
                  <option value="7d">Letzte 7 Tage</option>
                  <option value="30d">Letzte 30 Tage</option>
                  <option value="90d">Letzte 90 Tage</option>
                  <option value="1y">Letztes Jahr</option>
                  <option value="all">Alle Zeit</option>
                </select>
                
                <button 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  title="Daten exportieren"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            {/* View Tabs */}
            <div className="mt-6 flex space-x-4 border-b">
              <button
                onClick={() => setSelectedView('overview')}
                className={`pb-2 px-1 ${selectedView === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Übersicht
              </button>
              <button
                onClick={() => setSelectedView('analytics')}
                className={`pb-2 px-1 ${selectedView === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => setSelectedView('counselors')}
                className={`pb-2 px-1 ${selectedView === 'counselors' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Berater
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tests Gesamt</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {mockSupervisorData.globalStats.totalTests}
                    </p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Berater</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {mockSupervisorData.globalStats.totalCounselors}
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Klienten</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {mockSupervisorData.globalStats.totalClients}
                    </p>
                  </div>
                  <Eye className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Abschlussrate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {mockSupervisorData.globalStats.avgCompletionRate}%
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Risiko-Verteilung
              </h3>
              <div className="space-y-4">
                {mockSupervisorData.testsByRisk.map((risk) => (
                  <div key={risk.level}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium px-3 py-1 rounded-full ${getRiskColor(risk.level)}`}>
                        {risk.level}
                      </span>
                      <span className="text-gray-600">
                        {risk.count} Tests ({risk.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${risk.percentage}%`,
                          backgroundColor: risk.color === 'green' ? '#10b981' : 
                                         risk.color === 'yellow' ? '#f59e0b' : 
                                         risk.color === 'orange' ? '#f97316' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic & Device Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Geografische Verteilung
                </h3>
                <div className="space-y-3">
                  {mockSupervisorData.geographicData.map((geo) => (
                    <div key={geo.city} className="flex items-center justify-between">
                      <span className="text-gray-700">{geo.city}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{geo.tests} Tests</span>
                        <span className="text-red-600 font-medium">{geo.criticalRate}% kritisch</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Geräte-Verteilung
                </h3>
                <div className="space-y-3">
                  {mockSupervisorData.deviceData.map((device) => (
                    <div key={device.type} className="flex items-center justify-between">
                      <span className="text-gray-700">{device.type}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{device.count}</span>
                        <span className="text-blue-600 font-medium">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="space-y-6">
            {/* Abort Analytics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Abbruch-Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Abbrüche Gesamt</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockSupervisorData.abortAnalytics.totalAborts}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Abbruch-Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockSupervisorData.abortAnalytics.abortRate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Kritische Fragen</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockSupervisorData.abortAnalytics.criticalQuestions.length}
                  </p>
                </div>
              </div>
              
              <h4 className="font-bold text-gray-900 mb-3">Kritische Fragen:</h4>
              <div className="space-y-3">
                {mockSupervisorData.abortAnalytics.criticalQuestions.map((q) => (
                  <div key={q.questionId} className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{q.question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {q.abortCount} Abbrüche • Ø {q.avgTimeBeforeAbort}s vor Abbruch
                        </p>
                      </div>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                        {q.questionId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Fragen-Metriken
              </h3>
              <p className="text-gray-600 mb-4">
                Durchschnittliche Zeit pro Frage: <span className="font-bold text-blue-600">{mockSupervisorData.questionMetrics.avgTimePerQuestion}s</span>
              </p>
              
              <h4 className="font-bold text-gray-900 mb-3">Schwierigste Fragen (längste Denkzeit):</h4>
              <div className="space-y-3">
                {mockSupervisorData.questionMetrics.mostDifficultQuestions.map((q) => (
                  <div key={q.questionId} className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between">
                    <span className="font-medium">{q.questionId}</span>
                    <div className="flex items-center space-x-6">
                      <span className="text-gray-600">Ø {q.avgTime}s</span>
                      <span className="text-orange-600">{(q.changeRate * 100).toFixed(0)}% Änderungen</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedView === 'counselors' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Berater-Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klienten</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ø Risiko</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockSupervisorData.counselorPerformance.map((counselor) => (
                    <tr key={counselor.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {counselor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {counselor.clients}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {counselor.tests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          counselor.avgRisk >= 60 ? 'bg-red-100 text-red-600' :
                          counselor.avgRisk >= 40 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {counselor.avgRisk}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
