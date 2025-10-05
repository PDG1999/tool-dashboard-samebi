import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import ClientList from './ClientList';
import ClientDetail from './ClientDetail';
import Analytics from './Analytics';
import SettingsComponent from './Settings';
import NotificationCenter from './NotificationCenter';

type DashboardView = 'overview' | 'clients' | 'client-detail' | 'analytics' | 'settings';

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'overview', name: 'Übersicht', icon: LayoutDashboard },
    { id: 'clients', name: 'Klienten', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Einstellungen', icon: SettingsIcon },
  ];

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('client-detail');
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
    setCurrentView('clients');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <DashboardOverview />;
      case 'clients':
        return <ClientList onClientSelect={handleClientSelect} />;
      case 'client-detail':
        return selectedClientId ? (
          <ClientDetail 
            clientId={selectedClientId} 
            onBack={handleBackToClients} 
          />
        ) : null;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-samebi-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">SAMEBI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            title="Sidebar schließen"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as DashboardView);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-samebi-100 text-samebi-700 border-r-2 border-samebi-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Maria Schmidt</p>
              <p className="text-xs text-gray-500 truncate">m.schmidt@samebi.net</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Abmelden
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              title="Sidebar öffnen"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentView === 'overview' && 'Dashboard'}
                  {currentView === 'clients' && 'Klienten-Management'}
                  {currentView === 'client-detail' && 'Klienten-Details'}
                  {currentView === 'analytics' && 'Analytics'}
                  {currentView === 'settings' && 'Einstellungen'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <div className="hidden sm:block text-sm text-gray-500">
                {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
