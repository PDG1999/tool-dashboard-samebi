import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Eye,
  Download,
  MapPin,
  Smartphone,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

interface SupervisorData {
  globalStats: {
    totalTests: number;
    totalCounselors: number;
    totalClients: number;
    avgCompletionRate: number;
    avgTestDuration: number;
    mostCriticalCategory: string;
  };
  testsByRisk: Array<{ level: string; count: number; percentage: number; color: string }>;
  abortAnalytics: {
    totalAborts: number;
    abortRate: number;
    criticalQuestions: Array<any>;
  };
  geographicData: Array<{ city: string; tests: number; criticalRate: number }>;
  deviceData: Array<{ type: string; count: number; percentage: number }>;
  counselorPerformance: Array<{ name: string; clients: number; tests: number; avgRisk: number }>;
}

const SupervisorDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'analytics' | 'counselors'>('overview');
  const [data, setData] = useState<SupervisorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupervisorData();
  }, [dateRange]);

  const loadSupervisorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lade alle benötigten Daten parallel
      const [testsData, counselorsData] = await Promise.all([
        api.testResults.getAll(),
        api.counselors.getStats(),
      ]);

      // Berechne Statistiken aus echten Daten
      const totalTests = testsData.length;
      const completedTests = testsData.filter((t: any) => !t.aborted);
      const abortedTests = testsData.filter((t: any) => t.aborted);
      
      // Risiko-Verteilung
      const riskCounts = {
        'Niedrig': testsData.filter((t: any) => t.risk_level === 'low').length,
        'Mittel': testsData.filter((t: any) => t.risk_level === 'moderate').length,
        'Hoch': testsData.filter((t: any) => t.risk_level === 'high').length,
        'Kritisch': testsData.filter((t: any) => t.risk_level === 'critical').length,
      };

      const testsByRisk = Object.entries(riskCounts).map(([level, count]) => ({
        level,
        count,
        percentage: totalTests > 0 ? (count / totalTests) * 100 : 0,
        color: level === 'Niedrig' ? 'green' : level === 'Mittel' ? 'yellow' : level === 'Hoch' ? 'orange' : 'red'
      }));

      // Geografische Daten
      const geoMap = new Map<string, { count: number; critical: number }>();
      testsData.forEach((t: any) => {
        const city = t.tracking_data?.geo_data?.city || 'Unbekannt';
        const existing = geoMap.get(city) || { count: 0, critical: 0 };
        existing.count++;
        if (t.risk_level === 'critical') existing.critical++;
        geoMap.set(city, existing);
      });

      const geographicData = Array.from(geoMap.entries())
        .map(([city, data]) => ({
          city,
          tests: data.count,
          criticalRate: data.count > 0 ? (data.critical / data.count) * 100 : 0
        }))
        .sort((a, b) => b.tests - a.tests)
        .slice(0, 5);

      // Geräte-Daten
      const deviceMap = new Map<string, number>();
      testsData.forEach((t: any) => {
        const device = t.tracking_data?.device_type || 'Unbekannt';
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
      });

      const deviceData = Array.from(deviceMap.entries())
        .map(([type, count]) => ({
          type,
          count,
          percentage: totalTests > 0 ? (count / totalTests) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

      // Berater-Performance
      const counselorPerformance = counselorsData.map((c: any) => ({
        name: c.name,
        clients: parseInt(c.total_clients) || 0,
        tests: parseInt(c.total_tests) || 0,
        avgRisk: parseFloat(c.avg_risk_score) || 0
      }));

      setData({
        globalStats: {
          totalTests,
          totalCounselors: counselorsData.length,
          totalClients: counselorPerformance.reduce((sum: number, c: any) => sum + c.clients, 0),
          avgCompletionRate: totalTests > 0 ? (completedTests.length / totalTests) * 100 : 0,
          avgTestDuration: 0, // Wird später implementiert wenn test_duration in DB
          mostCriticalCategory: 'Daten verfügbar', // Wird später implementiert
        },
        testsByRisk,
        abortAnalytics: {
          totalAborts: abortedTests.length,
          abortRate: totalTests > 0 ? (abortedTests.length / totalTests) * 100 : 0,
          criticalQuestions: [] // Wird später implementiert wenn mehr Daten vorhanden
        },
        geographicData,
        deviceData,
        counselorPerformance
      });

    } catch (err: any) {
      console.error('Error loading supervisor data:', err);
      setError(err.message || 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'niedrig': return 'text-green-600 bg-green-50';
      case 'mittel': return 'text-yellow-600 bg-yellow-50';
      case 'hoch': return 'text-orange-600 bg-orange-50';
      case 'kritisch': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Lade Supervisor-Daten...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2 text-center">Fehler beim Laden</h2>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button
            onClick={loadSupervisorData}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Keine Daten verfügbar</p>
        </div>
      </div>
    );
  }

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
                  onClick={loadSupervisorData}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Daten aktualisieren"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Aktualisieren</span>
                </button>
                
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
                      {data.globalStats.totalTests}
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
                      {data.globalStats.totalCounselors}
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
                      {data.globalStats.totalClients}
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
                      {data.globalStats.avgCompletionRate.toFixed(1)}%
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
                {data.testsByRisk.map((risk) => (
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
                  {data.geographicData.map((geo) => (
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
                  {data.deviceData.map((device) => (
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
                    {data.abortAnalytics.totalAborts}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Abbruch-Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.abortAnalytics.abortRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Kritische Fragen</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.abortAnalytics.criticalQuestions.length}
                  </p>
                </div>
              </div>
              
              {data.abortAnalytics.criticalQuestions.length > 0 && (
                <>
                  <h4 className="font-bold text-gray-900 mb-3">Kritische Fragen:</h4>
                  <div className="space-y-3">
                    {data.abortAnalytics.criticalQuestions.map((q) => (
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
                <span className="font-medium">Fragen-Metriken werden mit mehr Daten angezeigt.</span>
              </p>
              
              <p className="text-gray-600 text-center py-4">
                Zusätzliche Analytics-Daten werden in zukünftigen Versionen verfügbar sein.
              </p>
            </div>

            {/* Question Metrics - Hidden for now
              <h4 className="font-bold text-gray-900 mb-3">Schwierigste Fragen (längste Denkzeit):</h4>
              <div className="space-y-3">
                {data.questionMetrics.mostDifficultQuestions.map((q) => (
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
                  {data.counselorPerformance.map((counselor) => (
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
