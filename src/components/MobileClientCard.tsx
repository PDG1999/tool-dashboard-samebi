import React from 'react';
import { Eye, Phone, Mail, Calendar, AlertTriangle } from 'lucide-react';
import { Client } from '../types/dashboard';

interface MobileClientCardProps {
  client: Client;
  onView: (clientId: string) => void;
  getRiskLevel: (clientId: string) => { level: string; color: string };
  getLastTestDate: (clientId: string) => string;
}

const MobileClientCard: React.FC<MobileClientCardProps> = ({
  client,
  onView,
  getRiskLevel,
  getLastTestDate
}) => {
  const risk = getRiskLevel(client.id);
  const lastTest = getLastTestDate(client.id);

  const getRiskColorClasses = (color: string) => {
    const colorMap = {
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100',
      gray: 'text-gray-600 bg-gray-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
          <p className="text-sm text-gray-500">ID: {client.id.slice(0, 8)}...</p>
        </div>
        <button
          onClick={() => onView(client.id)}
          className="p-2 text-samebi-600 hover:bg-samebi-50 rounded-lg transition-colors"
          title="Details anzeigen"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* Risk and Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColorClasses(risk.color)}`}>
          {risk.level}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status === 'active' ? 'Aktiv' : 
           client.status === 'inactive' ? 'Inaktiv' : 'Archiviert'}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        {client.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <span>{client.phone}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Letzter Test: {lastTest}</span>
        </div>
      </div>

      {/* Notes Preview */}
      {client.notes && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {client.notes}
          </p>
        </div>
      )}

      {/* High Risk Warning */}
      {risk.level === 'Kritisch' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm text-red-700 font-medium">
              Hochrisiko - Sofortige Aufmerksamkeit erforderlich
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileClientCard;
