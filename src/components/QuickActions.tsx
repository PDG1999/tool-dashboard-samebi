import React from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  onClick: () => void;
  description?: string;
}

interface QuickActionsProps {
  onNewClient: () => void;
  onNewTest: () => void;
  onExport: () => void;
  onSchedule: () => void;
  onViewClients: () => void;
  onViewAnalytics: () => void;
  urgentTasks?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewClient,
  onNewTest,
  onExport,
  onSchedule,
  onViewClients,
  onViewAnalytics,
  urgentTasks = 3
}) => {
  const actions: QuickAction[] = [
    {
      id: 'new-client',
      label: 'Neuer Klient',
      icon: Plus,
      color: 'text-white',
      bgColor: 'bg-samebi-600 hover:bg-samebi-700',
      onClick: onNewClient,
      description: 'Neuen Klienten hinzufügen'
    },
    {
      id: 'new-test',
      label: 'Test starten',
      icon: FileText,
      color: 'text-white',
      bgColor: 'bg-green-600 hover:bg-green-700',
      onClick: onNewTest,
      description: 'Neuen Screening-Test'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      onClick: onExport,
      description: 'Daten exportieren'
    },
    {
      id: 'schedule',
      label: 'Termine',
      icon: Calendar,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      onClick: onSchedule,
      description: 'Termine verwalten'
    },
    {
      id: 'clients',
      label: 'Klienten',
      icon: Users,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      onClick: onViewClients,
      description: 'Klienten-Übersicht'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      onClick: onViewAnalytics,
      description: 'Statistiken anzeigen'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Schnellaktionen</h3>
        {urgentTasks > 0 && (
          <div className="flex items-center space-x-1 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{urgentTasks} dringend</span>
          </div>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-3 rounded-lg transition-all duration-200 ${action.bgColor} ${action.color} text-left group`}
              title={action.description}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{action.label}</p>
                  <p className="text-xs opacity-75 truncate">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile List */}
      <div className="sm:hidden space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`w-full p-3 rounded-lg transition-all duration-200 ${action.bgColor} ${action.color} text-left`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{action.label}</p>
                  {action.description && (
                    <p className="text-xs opacity-75">{action.description}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Urgent Tasks Alert */}
      {urgentTasks > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">
                {urgentTasks} dringende Aufgabe{urgentTasks > 1 ? 'n' : ''} erfordern Ihre Aufmerksamkeit
              </p>
              <p className="text-xs text-orange-700">
                Klicken Sie hier, um die Liste anzuzeigen
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
