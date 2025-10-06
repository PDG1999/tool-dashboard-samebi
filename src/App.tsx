import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import SupervisorDashboard from './components/SupervisorDashboard';
import { LogIn } from 'lucide-react';
import { authAPI } from './services/api';

// Simple Login Component
interface LoginProps {
  type: 'counselor' | 'supervisor';
  onLogin: (isSupervisor: boolean) => void;
}

const LoginComponent: React.FC<LoginProps> = ({ type, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call real API
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data.token) {
        // Save token to localStorage
        localStorage.setItem('auth_token', response.data.token);
        
        // Check if user is supervisor
        const isSupervisor = response.data.counselor.role === 'supervisor';
        
        // Call onLogin callback
        onLogin(isSupervisor);
      } else {
        setError('Login fehlgeschlagen');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Ungültige Anmeldedaten');
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Noch kein Zugang? Kontaktieren Sie uns für ein Berater-Konto.
          </p>
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
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
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
