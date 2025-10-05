import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  Edit3,
  Key,
  Database,
  Download
} from 'lucide-react';

const Settings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    name: 'Dr. Maria Schmidt',
    email: 'm.schmidt@samebi.net',
    phone: '+49 123 456789',
    licenseNumber: 'PSY-12345',
    specialization: ['Suchtberatung', 'Verhaltenstherapie'],
    notifications: {
      newTests: true,
      followUps: true,
      weeklyReports: false,
      monthlyReports: true,
    },
    privacy: {
      dataRetention: '2years',
      anonymizeData: true,
      shareAnalytics: false,
    },
    language: 'de',
    timezone: 'Europe/Berlin',
  });

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Settings saved:', settings);
    setIsEditing(false);
    // Show success message
  };

  const handleExport = () => {
    // In real app, this would trigger data export
    console.log('Exporting data...');
  };

  const handleDeleteAccount = () => {
    // In real app, this would show confirmation dialog
    if (confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
          <p className="text-gray-600">Verwalten Sie Ihre Kontodaten und Präferenzen</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-samebi-600 text-white rounded-lg hover:bg-samebi-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-samebi-600 text-white rounded-lg hover:bg-samebi-700 transition-colors flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Bearbeiten
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Profil-Informationen</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lizenz-Nummer</label>
                <input
                  type="text"
                  value={settings.licenseNumber}
                  onChange={(e) => setSettings({...settings, licenseNumber: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Benachrichtigungen</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.newTests}
                  onChange={(e) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, newTests: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Neue Tests benachrichtigen</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.followUps}
                  onChange={(e) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, followUps: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Follow-up-Erinnerungen</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, weeklyReports: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Wöchentliche Berichte</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.monthlyReports}
                  onChange={(e) => setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, monthlyReports: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Monatliche Berichte</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Datenschutz</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datenaufbewahrung</label>
                <select
                  value={settings.privacy.dataRetention}
                  onChange={(e) => setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, dataRetention: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-samebi-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="1year">1 Jahr</option>
                  <option value="2years">2 Jahre</option>
                  <option value="5years">5 Jahre</option>
                  <option value="indefinite">Unbegrenzt</option>
                </select>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.privacy.anonymizeData}
                  onChange={(e) => setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, anonymizeData: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Daten anonymisieren</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.privacy.shareAnalytics}
                  onChange={(e) => setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, shareAnalytics: e.target.checked}
                  })}
                  disabled={!isEditing}
                  className="h-4 w-4 text-samebi-600 focus:ring-samebi-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Analytics-Daten teilen (anonymisiert)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Daten exportieren
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Key className="h-4 w-4 mr-2" />
                Passwort ändern
              </button>
              <button className="w-full flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Database className="h-4 w-4 mr-2" />
                Backup erstellen
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konto-Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm font-medium text-green-600">Aktiv</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mitglied seit</span>
                <span className="text-sm font-medium text-gray-900">Jan 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Letzte Anmeldung</span>
                <span className="text-sm font-medium text-gray-900">Heute</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Gefahrenbereich</h3>
            <p className="text-sm text-red-700 mb-4">
              Diese Aktionen können nicht rückgängig gemacht werden.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            >
              Konto löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
