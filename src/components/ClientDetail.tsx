import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Phone, Mail, Edit, Download, Printer, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Client, TestResult } from '../types/dashboard';
import { exportToPDF } from '../utils/export';
import api from '../services/api';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, onBack }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [client, setClient] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lade Client und dessen Tests
      const [clientData, testsData] = await Promise.all([
        api.clients.getById(clientId),
        api.testResults.getAll() // Alle Tests laden, dann filtern
      ]);

      setClient(clientData);
      // Filtere Tests für diesen Client
      const clientTests = testsData.filter((t: any) => t.client_id === clientId);
      setTestResults(clientTests);

    } catch (err: any) {
      console.error('Error loading client data:', err);
      setError(err.message || 'Fehler beim Laden der Client-Daten');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Lade Client-Daten...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Zurück
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2 text-center">Fehler beim Laden</h2>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button
            onClick={loadClientData}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // Not Found
  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Klient nicht gefunden</h3>
        <button 
          onClick={onBack}
          className="mt-4 text-samebi-600 hover:text-samebi-700"
        >
          Zurück zur Liste
        </button>
      </div>
    );
  }

  const latestTest = testResults.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Kritisch': return 'text-red-600 bg-red-100 border-red-200';
      case 'Hoch': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Mittel': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Niedrig': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zurück zur Klientenliste"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Klienten-Details und Test-Ergebnisse</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => latestTest && exportToPDF(latestTest, client)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF Export
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Drucken
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontaktinformationen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">E-Mail</p>
              <p className="text-sm text-gray-600">{client.email || 'Nicht angegeben'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Telefon</p>
              <p className="text-sm text-gray-600">{client.phone || 'Nicht angegeben'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Registriert</p>
              <p className="text-sm text-gray-600">{formatDate(client.createdAt)}</p>
            </div>
          </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Letzter Test</p>
                <p className="text-sm text-gray-600">
                  {latestTest ? formatDate(latestTest.created_at) : 'Noch kein Test'}
                </p>
              </div>
            </div>
        </div>
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-2">Notizen</p>
            <p className="text-sm text-gray-600">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Latest Test Results */}
      {latestTest && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Letzter Test</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(
                latestTest.risk_level === 'critical' ? 'Kritisch' : 
                latestTest.risk_level === 'high' ? 'Hoch' :
                latestTest.risk_level === 'moderate' ? 'Mittel' : 'Niedrig'
              )}`}>
                {latestTest.risk_level === 'critical' ? 'Kritisch' : 
                 latestTest.risk_level === 'high' ? 'Hoch' :
                 latestTest.risk_level === 'moderate' ? 'Mittel' : 'Niedrig'}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(latestTest.created_at)}
              </span>
            </div>
          </div>

          {/* Overall Risk Score */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Gesamt-Risiko</h4>
              <span className={`text-2xl font-bold ${getScoreColor(
                latestTest.professional_scores?.overall || 50
              )}`}>
                {latestTest.professional_scores?.overall || 'N/A'}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  (latestTest.professional_scores?.overall || 50) >= 80 ? 'bg-red-500' :
                  (latestTest.professional_scores?.overall || 50) >= 60 ? 'bg-orange-500' :
                  (latestTest.professional_scores?.overall || 50) >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${latestTest.professional_scores?.overall || 50}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Primärer Verdacht: <span className="font-medium">{latestTest.primary_concern || 'Keine Angabe'}</span>
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {(latestTest.professional_scores?.categories || []).map((category: any, index: number) => {
              const score = category.score || 0;
              const categoryName = category.name || 'Unbekannt';
              const risk = category.risk || 'Unbekannt';
              
              // Icon basierend auf Kategorie-Namen
              const icon = categoryName.includes('Zeit') ? '⏰' :
                          categoryName.includes('Finanz') ? '💰' :
                          categoryName.includes('Emotion') ? '😔' :
                          categoryName.includes('Sozial') ? '👥' :
                          categoryName.includes('Gesundheit') ? '🏥' : '📊';
              
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{icon}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{categoryName}</p>
                  <p className="text-xs text-gray-600 mb-2">Risiko: {risk}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        score >= 80 ? 'bg-red-500' :
                        score >= 60 ? 'bg-orange-500' :
                        score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Konsistenz</h4>
              <p className="text-2xl font-bold text-blue-600">{latestTest.professional_scores?.consistency || 'N/A'}%</p>
              <p className="text-sm text-blue-700">Antwort-Konsistenz</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Confidence</h4>
              <p className="text-2xl font-bold text-green-600">{latestTest.professional_scores?.confidence || 'N/A'}%</p>
              <p className="text-sm text-green-700">Ergebnis-Zuverlässigkeit</p>
            </div>
          </div>

          {/* Session Notes */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Session-Notizen</h4>
              <button 
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-samebi-600 hover:text-samebi-700 flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditingNotes ? 'Speichern' : 'Bearbeiten'}
              </button>
            </div>
            {isEditingNotes ? (
              <textarea
                value={sessionNotes || latestTest.session_notes || ''}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent"
                rows={4}
                placeholder="Session-Notizen eingeben..."
              />
            ) : (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {latestTest.session_notes || 'Keine Notizen vorhanden'}
              </p>
            )}
          </div>

          {/* Follow-up */}
          {latestTest.follow_up_required && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-800">Follow-up erforderlich</h4>
                  <p className="text-yellow-700">
                    {latestTest.follow_up_date 
                      ? `Nächster Termin: ${formatDate(latestTest.follow_up_date)}`
                      : 'Follow-up-Datum nicht festgelegt'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test History */}
      {testResults.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test-Verlauf</h3>
          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div key={test.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-samebi-100 text-samebi-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {testResults.length - index}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(test.created_at)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {test.primary_concern || 'N/A'} • {
                        test.risk_level === 'critical' ? 'Kritisch' :
                        test.risk_level === 'high' ? 'Hoch' :
                        test.risk_level === 'moderate' ? 'Mittel' : 'Niedrig'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                    test.risk_level === 'critical' ? 'Kritisch' :
                    test.risk_level === 'high' ? 'Hoch' :
                    test.risk_level === 'moderate' ? 'Mittel' : 'Niedrig'
                  )}`}>
                    {test.professional_scores?.overall || 'N/A'}/100
                  </span>
                  {test.follow_up_required && (
                    <CheckCircle className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
