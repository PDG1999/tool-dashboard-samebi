import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import SupervisorDashboard from './components/SupervisorDashboard';
import { LogIn } from 'lucide-react';

// Simple Login Component
interface LoginProps {
  type: 'counselor' | 'supervisor';
  onLogin: (isSupervisor: boolean) => void;
}

const LoginComponent: React.FC<LoginProps> = ({ type, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo login credentials
    if (type === 'supervisor') {
      if (email === 'supervisor@samebi.net' && password === 'Supervisor2025!') {
        onLogin(true);
      } else {
        setError('Ungültige Supervisor-Zugangsdaten');
      }
    } else {
      if (email === 'berater@samebi.net' && password === 'Demo2025!') {
        onLogin(false);
      } else {
        setError('Ungültige Berater-Zugangsdaten');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {type === 'supervisor' ? 'Supervisor Login' : 'Berater Login'}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          SAMEBI Lebensbalance-Check Dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="ihre.email@beispiel.de"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Anmelden
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo-Zugangsdaten:</p>
          {type === 'supervisor' ? (
            <>
              <p>E-Mail: supervisor@samebi.net</p>
              <p>Passwort: Supervisor2025!</p>
            </>
          ) : (
            <>
              <p>E-Mail: berater@samebi.net</p>
              <p>Passwort: Demo2025!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);

  const handleLogin = (supervisor: boolean) => {
    setIsAuthenticated(true);
    setIsSupervisor(supervisor);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsSupervisor(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Counselor Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout} />
              ) : (
                <LoginComponent type="counselor" onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Supervisor Dashboard */}
          <Route 
            path="/supervisor" 
            element={
              isAuthenticated && isSupervisor ? (
                <SupervisorDashboard />
              ) : (
                <LoginComponent type="supervisor" onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
