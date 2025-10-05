import React, { useState } from 'react';
import { ArrowLeft, Calendar, Phone, Mail, Edit, Download, Printer, AlertTriangle, CheckCircle } from 'lucide-react';
import { Client, TestResult } from '../types/dashboard';
import { mockClients, mockTestResults } from '../data/mockData';
import { exportToPDF } from '../utils/export';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, onBack }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  
  const client = mockClients.find(c => c.id === clientId);
  const testResults = mockTestResults.filter(test => test.clientId === clientId);
  const latestTest = testResults.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];

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
                {client.lastTestAt ? formatDate(client.lastTestAt) : 'Noch kein Test'}
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(latestTest.professionalScores.riskLevel)}`}>
                {latestTest.professionalScores.riskLevel}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(latestTest.completedAt)}
              </span>
            </div>
          </div>

          {/* Overall Risk Score */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Gesamt-Risiko</h4>
              <span className={`text-2xl font-bold ${getScoreColor(latestTest.professionalScores.overall)}`}>
                {latestTest.professionalScores.overall}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  latestTest.professionalScores.overall >= 80 ? 'bg-red-500' :
                  latestTest.professionalScores.overall >= 60 ? 'bg-orange-500' :
                  latestTest.professionalScores.overall >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${latestTest.professionalScores.overall}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Primärer Verdacht: <span className="font-medium">{latestTest.professionalScores.primaryConcern}</span>
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { key: 'gambling', label: 'Spielsucht', icon: '🎰' },
              { key: 'alcohol', label: 'Alkohol', icon: '🍷' },
              { key: 'substances', label: 'Substanzen', icon: '💊' },
              { key: 'shopping', label: 'Kaufsucht', icon: '🛍️' },
              { key: 'digital', label: 'Digital', icon: '📱' },
            ].map(({ key, label, icon }) => {
              const score = latestTest.professionalScores[key as keyof typeof latestTest.professionalScores] as number;
              return (
                <div key={key} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{icon}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
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
              <p className="text-2xl font-bold text-blue-600">{latestTest.professionalScores.consistency}%</p>
              <p className="text-sm text-blue-700">Antwort-Konsistenz</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Confidence</h4>
              <p className="text-2xl font-bold text-green-600">{latestTest.professionalScores.confidence}%</p>
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
                value={sessionNotes || latestTest.sessionNotes || ''}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent"
                rows={4}
                placeholder="Session-Notizen eingeben..."
              />
            ) : (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {latestTest.sessionNotes || 'Keine Notizen vorhanden'}
              </p>
            )}
          </div>

          {/* Follow-up */}
          {latestTest.followUpRequired && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-800">Follow-up erforderlich</h4>
                  <p className="text-yellow-700">
                    {latestTest.followUpDate 
                      ? `Nächster Termin: ${formatDate(latestTest.followUpDate)}`
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
                      {formatDate(test.completedAt)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {test.professionalScores.primaryConcern} • {test.professionalScores.riskLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(test.professionalScores.riskLevel)}`}>
                    {test.professionalScores.overall}/100
                  </span>
                  {test.followUpRequired && (
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
