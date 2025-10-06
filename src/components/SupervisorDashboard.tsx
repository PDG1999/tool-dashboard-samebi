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
  Smartphone
} from 'lucide-react';
import AllTestsView from './AllTestsView';
import { api } from '../services/api';

// Real data is now fetched from API - no more mock data needed!

const SupervisorDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'analytics' | 'tests' | 'counselors'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testResults, clientsData, counselorsData] = await Promise.all([
          api.getTestResults(),
          api.getClients().catch(() => []),
          api.getCounselors().catch(() => [])
        ]);

        setTests(testResults);
        setClients(clientsData);
        setCounselors(counselorsData);

        // Calculate real statistics
        const totalTests = testResults.length;
        const completedTests = testResults.filter((t: any) => !t.aborted).length;
        const abortedTests = testResults.filter((t: any) => t.aborted).length;
        const criticalTests = testResults.filter((t: any) => 
          t.risk_level === 'Kritisch' || t.risk_level === 'critical'
        ).length;

        // Risk distribution
        const riskCounts = testResults.reduce((acc: any, test: any) => {
          const risk = test.risk_level || 'Unbekannt';
          acc[risk] = (acc[risk] || 0) + 1;
          return acc;
        }, {});

        // Device distribution
        const deviceCounts = testResults.reduce((acc: any, test: any) => {
          const device = test.device_type || 'Unknown';
          acc[device] = (acc[device] || 0) + 1;
          return acc;
        }, {});

        // Geographic distribution
        const cityCounts = testResults.reduce((acc: any, test: any) => {
          const city = test.city || 'Unbekannt';
          if (city !== 'Unbekannt') {
            acc[city] = (acc[city] || 0) + 1;
          }
          return acc;
        }, {});

        // Abort analytics
        const abortedTestsData = testResults.filter((t: any) => t.aborted);
        const abortRate = totalTests > 0 ? ((abortedTests / totalTests) * 100).toFixed(1) : 0;
        
        // Question abort analysis
        const questionAborts = abortedTestsData.reduce((acc: any, test: any) => {
          const questionNum = test.aborted_at_question;
          if (questionNum) {
            if (!acc[questionNum]) {
              acc[questionNum] = { count: 0, questionNum };
            }
            acc[questionNum].count++;
          }
          return acc;
        }, {});
        
        const criticalQuestions = Object.values(questionAborts)
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalTests,
          completedTests,
          abortedTests,
          criticalTests,
          totalClients: clientsData.length,
          totalCounselors: counselorsData.length,
          avgCompletionRate: totalTests > 0 ? (completedTests / totalTests * 100).toFixed(1) : 0,
          riskDistribution: riskCounts,
          deviceDistribution: deviceCounts,
          cityDistribution: cityCounts,
          abortRate,
          criticalQuestions
        });

      } catch (error) {
        console.error('Error fetching supervisor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

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
                onClick={() => setSelectedView('tests')}
                className={`pb-2 px-1 ${selectedView === 'tests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                🔍 Alle Tests
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
        {selectedView === 'tests' && <AllTestsView />}
        
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Lade Daten...</p>
              </div>
            ) : stats ? (
              <>
                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Tests Gesamt</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {stats.totalTests}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.completedTests} abgeschlossen, {stats.abortedTests} abgebrochen
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
                          {stats.totalCounselors}
                        </p>
                      </div>
                      <Users className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Kritische Fälle</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">
                          {stats.criticalTests}
                        </p>
                      </div>
                      <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">Abschlussrate</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {stats.avgCompletionRate}%
                        </p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-orange-600" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-600">
                Keine Daten verfügbar
              </div>
            )}

            {/* Risk Distribution */}
            {stats && stats.riskDistribution && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Risiko-Verteilung
                </h3>
                <div className="space-y-4">
                  {Object.entries(stats.riskDistribution).map(([level, count]: [string, any]) => {
                    const percentage = stats.totalTests > 0 ? ((count / stats.totalTests) * 100).toFixed(1) : 0;
                    return (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium px-3 py-1 rounded-full ${getRiskColor(level)}`}>
                            {level}
                          </span>
                          <span className="text-gray-600">
                            {count} Tests ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Geographic & Device Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats && stats.cityDistribution && Object.keys(stats.cityDistribution).length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Geografische Verteilung
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.cityDistribution)
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .slice(0, 10)
                      .map(([city, count]: [string, any]) => (
                        <div key={city} className="flex items-center justify-between">
                          <span className="text-gray-700">{city}</span>
                          <span className="text-gray-600">{count} Tests</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {stats && stats.deviceDistribution && Object.keys(stats.deviceDistribution).length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Geräte-Verteilung
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.deviceDistribution).map(([device, count]: [string, any]) => {
                      const percentage = stats.totalTests > 0 ? ((count / stats.totalTests) * 100).toFixed(1) : 0;
                      return (
                        <div key={device} className="flex items-center justify-between">
                          <span className="text-gray-700">{device}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">{count}</span>
                            <span className="text-blue-600 font-medium">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Lade Analytics...</p>
              </div>
            ) : stats ? (
              <>
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
                        {stats.abortedTests}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Abbruch-Rate</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.abortRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Kritische Fragen</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.criticalQuestions?.length || 0}
                      </p>
                    </div>
                  </div>
                  
                  {stats.criticalQuestions && stats.criticalQuestions.length > 0 && (
                    <>
                      <h4 className="font-bold text-gray-900 mb-3">Häufigste Abbruch-Fragen:</h4>
                      <div className="space-y-3">
                        {stats.criticalQuestions.map((q: any) => (
                          <div key={q.questionNum} className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">Frage #{q.questionNum}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {q.count} Abbrüche bei dieser Frage
                                </p>
                              </div>
                              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                                {q.count}x
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Completion Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Test-Statistiken
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm">Abgeschlossene Tests</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completedTests}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.avgCompletionRate}% Abschlussrate
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Abgebrochene Tests</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.abortedTests}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.abortRate}% Abbruchrate
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Kritische Fälle</p>
                      <p className="text-2xl font-bold text-red-600">{stats.criticalTests}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.totalTests > 0 ? ((stats.criticalTests / stats.totalTests) * 100).toFixed(1) : 0}% aller Tests
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-600">
                Keine Analytics-Daten verfügbar
              </div>
            )}
          </div>
        )}

        {selectedView === 'counselors' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Berater-Übersicht
            </h3>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Lade Berater-Daten...</p>
              </div>
            ) : counselors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-Mail</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rolle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lizenz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klienten</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {counselors.map((counselor: any) => {
                      const counselorClients = clients.filter((c: any) => c.counselor_id === counselor.id);
                      const counselorTests = tests.filter((t: any) => t.counselor_id === counselor.id);
                      
                      return (
                        <tr key={counselor.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {counselor.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {counselor.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              counselor.role === 'supervisor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {counselor.role === 'supervisor' ? '👑 Supervisor' : '👤 Berater'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {counselor.license_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              counselor.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {counselor.is_active ? '✅ Aktiv' : '❌ Inaktiv'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {counselorClients.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {counselorTests.length}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                Keine Berater-Daten verfügbar
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
