import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataProviderFactory } from '../data/DataProviderFactory';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Database,
  Shield,
  Info,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Smartphone,
  Moon,
  Sun,
  Bell,
  Globe,
  HelpCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Settings', current: true }
  ];

  // Get app statistics
  const customers = dataProvider.getCustomers();
  const jobs = dataProvider.getJobs();
  const unpaidJobs = jobs.filter(job => job.paymentStatus === 'unpaid');
  const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

  const handleExportData = () => {
    try {
      const data = dataProvider.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `myjobtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.customers || !data.jobs || !Array.isArray(data.customers) || !Array.isArray(data.jobs)) {
          setImportError('Invalid file format. Please select a valid MyJobTrack backup file.');
          return;
        }

        const success = dataProvider.importData(data);
        if (success) {
          setShowImportSuccess(true);
          setTimeout(() => setShowImportSuccess(false), 3000);
          setImportError('');
        } else {
          setImportError('Failed to import data. Please try again.');
        }
      } catch (error) {
        setImportError('Invalid JSON file. Please select a valid backup file.');
      }
    };
    
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      dataProvider.clearAllData();
      setShowClearConfirm(false);
      navigate('/app', { 
        state: { message: 'All data has been cleared successfully.' }
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const settingSections = [
    {
      title: 'Data Management',
      icon: Database,
      items: [
        {
          title: 'Export Data',
          description: 'Download a backup of all your customers and jobs',
          icon: Download,
          action: handleExportData,
          variant: 'primary' as const
        },
        {
          title: 'Import Data',
          description: 'Restore data from a backup file',
          icon: Upload,
          action: () => fileInputRef.current?.click(),
          variant: 'secondary' as const
        },
        {
          title: 'Clear All Data',
          description: 'Permanently delete all customers and jobs',
          icon: Trash2,
          action: () => setShowClearConfirm(true),
          variant: 'danger' as const
        }
      ]
    },
    {
      title: 'App Preferences',
      icon: SettingsIcon,
      items: [
        {
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          icon: darkMode ? Moon : Sun,
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
        {
          title: 'Notifications',
          description: 'Enable push notifications for reminders',
          icon: Bell,
          toggle: true,
          value: notifications,
          onChange: setNotifications
        }
      ]
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        {
          title: 'User Guide',
          description: 'Learn how to use MyJobTrack',
          icon: FileText,
          external: true
        },
        {
          title: 'Contact Support',
          description: 'Get help with technical issues',
          icon: ExternalLink,
          external: true
        },
        {
          title: 'Feature Requests',
          description: 'Suggest new features or improvements',
          icon: ExternalLink,
          external: true
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Success Messages */}
      {showExportSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Data exported successfully!</p>
          </div>
          <button
            onClick={() => setShowExportSuccess(false)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {showImportSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Data imported successfully!</p>
          </div>
          <button
            onClick={() => setShowImportSuccess(false)}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Import Error */}
      {importError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">{importError}</p>
          </div>
          <button
            onClick={() => setImportError('')}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your app preferences and data</p>
          </div>
        </div>
      </div>

      {/* App Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600" />
          App Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-blue-900">{customers.length}</p>
                <p className="text-sm text-blue-700">Customers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-green-900">{jobs.length}</p>
                <p className="text-sm text-green-700">Total Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-orange-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-orange-900">${totalUnpaid.toFixed(0)}</p>
                <p className="text-sm text-orange-700">Unpaid</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Smartphone className="h-6 w-6 text-purple-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-purple-900">v1.0.0</p>
                <p className="text-sm text-purple-700">Version</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <section.icon className="h-5 w-5 mr-2 text-blue-600" />
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className="bg-white p-2 rounded-lg mr-4 shadow-sm">
                        <item.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {item.toggle ? (
                        <button
                          onClick={() => item.onChange?.(!(item.value as boolean))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : item.external ? (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                          Open
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </button>
                      ) : (
                        <button
                          onClick={item.action}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            item.variant === 'primary'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : item.variant === 'danger'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {item.title}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* App Information */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About MyJobTrack</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Customer Management</li>
              <li>• Job Scheduling & Tracking</li>
              <li>• Payment Management</li>
              <li>• QR Code Integration</li>
              <li>• Mobile-First Design</li>
              <li>• Offline Data Storage</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Technical Info</h3>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• Version: 1.0.0</li>
              <li>• Data Storage: Local Browser</li>
              <li>• Platform: Progressive Web App</li>
              <li>• Last Updated: {new Date().toLocaleDateString()}</li>
              <li>• Built with React & TypeScript</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportData}
        className="hidden"
      />

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm mb-3">
                <strong>Warning:</strong> This will permanently delete:
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• All {customers.length} customers</li>
                <li>• All {jobs.length} jobs</li>
                <li>• All payment records</li>
                <li>• All app data</li>
              </ul>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              Make sure you have exported your data if you want to keep a backup. 
              This action will reset the app to its initial state.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClearAllData}
                disabled={isClearing}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isClearing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </>
                )}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;