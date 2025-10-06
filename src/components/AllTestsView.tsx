import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Smartphone,
  X,
  Download,
  Calendar
} from 'lucide-react';
import { testResultsAPI } from '../services/api';

interface TestResult {
  id: string;
  session_id: string;
  responses: any[];
  public_scores: {
    overall: number;
    stress: number;
    health: number;
    social: number;
  };
  professional_scores: {
    overall: number;
    gambling: number;
    alcohol: number;
    substances: number;
    shopping: number;
    digital: number;
    riskLevel: 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch';
    primaryConcern: string;
    addictionDirection?: {
      primary?: {
        type: string;
        confidence: number;
        indicators: string[];
      };
      secondary?: {
        type: string;
        confidence: number;
        indicators: string[];
      };
      patterns?: {
        polyaddiction: boolean;
        substanceBased: number;
        behavioralBased: number;
      };
    };
  };
  tracking_data: {
    browser_fingerprint?: string;
    ip_address?: string;
    user_agent?: string;
    geo_data?: {
      city?: string;
      country?: string;
    };
    device_type?: string;
  };
  aborted: boolean;
  aborted_at_question?: number;
  completed_questions: number;
  created_at: string;
}

const AllTestsView: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all'); // New: Filter by source

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await testResultsAPI.getAll();
      setTests(data);
    } catch (error) {
      console.error('Fehler beim Laden der Tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'niedrig': return 'bg-green-100 text-green-800';
      case 'mittel': return 'bg-yellow-100 text-yellow-800';
      case 'hoch': return 'bg-orange-100 text-orange-800';
      case 'kritisch': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTests = tests.filter(test => {
    if (filterRisk !== 'all' && test.professional_scores.riskLevel !== filterRisk) return false;
    if (filterStatus === 'completed' && test.aborted) return false;
    if (filterStatus === 'aborted' && !test.aborted) return false;
    
    // Filter by source (anonymous vs assigned)
    if (filterSource === 'anonymous') {
      // Check if counselor is system account
      // We'll need to fetch counselor email or check if it's the system account
      // For now, we can check if client_id is null or counselor_id matches system
      // This will be improved when we add counselor info to the response
    }
    if (filterSource === 'assigned' && !test.client_id) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Lade Tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quelle
            </label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">Alle Tests</option>
              <option value="anonymous">🌐 Anonyme Tests (System)</option>
              <option value="assigned">👤 Zugewiesene Tests</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risiko-Level
            </label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">Alle</option>
              <option value="Niedrig">Niedrig</option>
              <option value="Mittel">Mittel</option>
              <option value="Hoch">Hoch</option>
              <option value="Kritisch">Kritisch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">Alle</option>
              <option value="completed">Abgeschlossen</option>
              <option value="aborted">Abgebrochen</option>
            </select>
          </div>

          <div className="ml-auto flex items-end">
            <button
              onClick={loadTests}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Aktualisieren</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Tests Gesamt</p>
          <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Abgeschlossen</p>
          <p className="text-2xl font-bold text-green-600">
            {tests.filter(t => !t.aborted).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Abgebrochen</p>
          <p className="text-2xl font-bold text-orange-600">
            {tests.filter(t => t.aborted).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Kritische Fälle</p>
          <p className="text-2xl font-bold text-red-600">
            {tests.filter(t => t.professional_scores.riskLevel === 'Kritisch').length}
          </p>
        </div>
      </div>

      {/* Test List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risiko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hauptanliegen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standort
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Keine Tests gefunden
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(test.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(test.professional_scores.riskLevel)}`}>
                        {test.professional_scores.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.professional_scores.addictionDirection?.primary?.type || test.professional_scores.primaryConcern}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {test.aborted ? (
                        <span className="flex items-center text-sm text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Abbruch bei Frage {test.aborted_at_question}
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-green-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Abgeschlossen
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {test.tracking_data?.geo_data?.city || 'Unbekannt'}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Smartphone className="w-3 h-3 mr-1" />
                        {test.tracking_data?.device_type || 'Desktop'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Test-Details</h2>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Risk Overview */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Risiko-Bewertung</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Gesamt-Risiko</p>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 ${getRiskColor(selectedTest.professional_scores.riskLevel)}`}>
                      {selectedTest.professional_scores.riskLevel}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedTest.professional_scores.overall}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hauptanliegen</p>
                    <p className="text-sm font-medium text-gray-900">{selectedTest.professional_scores.primaryConcern}</p>
                  </div>
                </div>
              </div>

              {/* Addiction Direction */}
              {selectedTest.professional_scores.addictionDirection && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Suchtrichtung-Analyse</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Primäre Richtung</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {selectedTest.professional_scores.addictionDirection.primary?.type || 'Unbekannt'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Konfidenz: {selectedTest.professional_scores.addictionDirection.primary?.confidence || 0}%
                      </p>
                    </div>
                    {selectedTest.professional_scores.addictionDirection.secondary && (
                      <div>
                        <p className="text-sm text-gray-600">Sekundäre Richtung</p>
                        <p className="text-lg font-semibold text-blue-800">
                          {selectedTest.professional_scores.addictionDirection.secondary?.type || 'Unbekannt'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Konfidenz: {selectedTest.professional_scores.addictionDirection.secondary?.confidence || 0}%
                        </p>
                      </div>
                    )}
                    {selectedTest.professional_scores.addictionDirection.patterns && (
                      <div>
                        <p className="text-sm text-gray-600">Muster-Analyse</p>
                        <div className="mt-2 space-y-1 text-xs">
                          {selectedTest.professional_scores.addictionDirection.patterns.polyaddiction && (
                            <p className="text-orange-600">⚠️ Polysucht-Muster erkannt</p>
                          )}
                          <p className="text-gray-600">
                            Substanzbasiert: {selectedTest.professional_scores.addictionDirection.patterns.substanceBased}%
                          </p>
                          <p className="text-gray-600">
                            Verhaltensbasiert: {selectedTest.professional_scores.addictionDirection.patterns.behavioralBased}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category Scores */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kategorien-Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Glücksspiel</p>
                    <p className="text-xl font-bold text-gray-900">{selectedTest.professional_scores.gambling}/100</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Alkohol</p>
                    <p className="text-xl font-bold text-gray-900">{selectedTest.professional_scores.alcohol}/100</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Substanzen</p>
                    <p className="text-xl font-bold text-gray-900">{selectedTest.professional_scores.substances}/100</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Shopping</p>
                    <p className="text-xl font-bold text-gray-900">{selectedTest.professional_scores.shopping}/100</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-600">Digital</p>
                    <p className="text-xl font-bold text-gray-900">{selectedTest.professional_scores.digital}/100</p>
                  </div>
                </div>
              </div>

              {/* Tracking Data */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking-Informationen</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Datum:</span>
                    <span className="font-medium">{new Date(selectedTest.created_at).toLocaleString('de-DE')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standort:</span>
                    <span className="font-medium">
                      {selectedTest.tracking_data?.geo_data?.city || 'Unbekannt'}, {selectedTest.tracking_data?.geo_data?.country || 'Unbekannt'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gerät:</span>
                    <span className="font-medium">{selectedTest.tracking_data?.device_type || 'Desktop'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fragen beantwortet:</span>
                    <span className="font-medium">{selectedTest.completed_questions}/40</span>
                  </div>
                  {selectedTest.aborted && (
                    <div className="flex justify-between text-orange-600">
                      <span>Abbruch bei Frage:</span>
                      <span className="font-medium">{selectedTest.aborted_at_question}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Schließen
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTestsView;

