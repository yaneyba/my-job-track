import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import ThemeToggle from '@/components/UI/ThemeToggle';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Database,
  Info,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Smartphone,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Palette,
  Languages,
  Globe
} from 'lucide-react';

// TypeScript interfaces for settings items
interface BaseSettingItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ComponentSettingItem extends BaseSettingItem {
  component: React.ReactElement;
}

interface ToggleSettingItem extends BaseSettingItem {
  toggle: true;
  value: boolean;
  onChange: (value: boolean) => void;
}

interface ActionSettingItem extends BaseSettingItem {
  action: () => void;
  variant: 'primary' | 'secondary' | 'danger';
}

interface ExternalSettingItem extends BaseSettingItem {
  external: true;
}

type SettingItem = ComponentSettingItem | ToggleSettingItem | ActionSettingItem | ExternalSettingItem;

interface SettingSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SettingItem[];
}

const Settings: React.FC = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();
  const { isDark } = useTheme();
  const { isDemoMode } = useDemo();
  const { language, setLanguage, t } = useLanguage();

  const breadcrumbItems = [
    { label: t('nav.home'), href: '/app' },
    { label: t('nav.settings'), current: true }
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
        console.error('Import error:', error);
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
    console.log('handleClearAllData started');
    setIsClearing(true);
    try {
      console.log('About to wait 1 second...');
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Calling dataProvider.clearAllData()...');
      dataProvider.clearAllData();
      console.log('Data cleared successfully, closing modal');
      setShowClearConfirm(false); // Close modal on success
      console.log('Modal should be closed now, about to navigate...');
      // Small delay before navigation to ensure modal closes
      setTimeout(() => {
        console.log('Navigating to /app...');
        navigate('/app', { 
          state: { message: isDemoMode ? 'User data cleared. Demo data has been restored.' : 'All data has been cleared successfully.' }
        });
      }, 100);
    } catch (error) {
      console.error('Failed to clear data:', error);
      setImportError('Failed to clear data. Please try again.');
      setShowClearConfirm(false); // Close modal and show error message
    } finally {
      console.log('Setting isClearing to false');
      setIsClearing(false);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
  };

  const settingSections: SettingSection[] = [
    {
      title: t('settings.appearance'),
      icon: Palette,
      items: [
        {
          title: t('settings.language'),
          description: t('settings.languageDescription'),
          icon: Languages,
          component: (
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 dark:bg-dark-700 rounded-lg p-1 transition-colors duration-200">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    language === 'en'
                      ? 'bg-white dark:bg-dark-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {t('common.english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                    language === 'es'
                      ? 'bg-white dark:bg-dark-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {t('common.spanish')}
                </button>
              </div>
            </div>
          )
        },
        {
          title: t('settings.theme'),
          description: t('settings.themeDescription', { mode: isDark ? t('common.dark') : t('common.light') }),
          icon: isDark ? Moon : Sun,
          component: (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isDark ? t('common.dark') : t('common.light')}
              </span>
              <ThemeToggle size="sm" />
            </div>
          )
        }
      ]
    },
    {
      title: t('settings.dataManagement'),
      icon: Database,
      items: [
        {
          title: t('settings.exportData'),
          description: t('settings.exportDescription'),
          icon: Download,
          action: handleExportData,
          variant: 'primary' as const
        },
        {
          title: t('settings.importData'),
          description: t('settings.importDescription'),
          icon: Upload,
          action: () => fileInputRef.current?.click(),
          variant: 'secondary' as const
        },
        {
          title: t('settings.clearAllData'),
          description: t('settings.clearDescription'),
          icon: Trash2,
          action: () => setShowClearConfirm(true),
          variant: 'danger' as const
        }
      ]
    },
    {
      title: t('settings.appPreferences'),
      icon: SettingsIcon,
      items: [
        {
          title: t('settings.notifications'),
          description: t('settings.notificationsDescription'),
          icon: Bell,
          toggle: true, 
          value: notifications, 
          onChange: setNotifications 
        }
      ]
    },
    {
      title: t('settings.helpSupport'),
      icon: HelpCircle,
      items: [
        {
          title: t('settings.userGuide'),
          description: t('settings.userGuideDescription'),
          icon: FileText,
          external: true
        },
        {
          title: t('settings.contactSupport'),
          description: t('settings.contactDescription'),
          icon: ExternalLink,
          external: true
        },
        {
          title: t('settings.featureRequests'),
          description: t('settings.featureDescription'),
          icon: ExternalLink,
          external: true
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Success Messages */}
      {showExportSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-green-800 dark:text-green-200 font-medium">Data exported successfully!</p>
          </div>
          <button
            onClick={() => setShowExportSuccess(false)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {showImportSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <p className="text-green-800 dark:text-green-200 font-medium">Data imported successfully!</p>
          </div>
          <button
            onClick={() => setShowImportSuccess(false)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Import Error */}
      {importError && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200 font-medium">{importError}</p>
          </div>
          <button
            onClick={() => setImportError('')}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('settings.description')}</p>
          </div>
        </div>
      </div>

      {/* App Statistics */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-8 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          {t('settings.appStatistics')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{customers.length}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{t('common.customers')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <div>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">{jobs.length}</p>
                <p className="text-sm text-green-700 dark:text-green-300">{t('common.total')} {t('common.jobs')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2" />
              <div>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">${totalUnpaid.toFixed(0)}</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">{t('common.unpaid')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
              <div>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">v1.0.0</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">{t('settings.version')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <section.icon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {/* Regular layout for all items */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
                      <div className="flex items-start sm:items-center flex-1 mb-4 sm:mb-0">
                        <div className="bg-white dark:bg-dark-800 p-2 rounded-lg mr-4 shadow-sm flex-shrink-0">
                          <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 w-full sm:w-auto sm:ml-4">
                        {'component' in item ? (
                          <div className="w-full">
                            {item.component}
                          </div>
                        ) : 'toggle' in item ? (
                          <button
                            onClick={() => item.onChange(!(item.value as boolean))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : 'external' in item ? (
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center">
                            {t('common.open')}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </button>
                        ) : (
                          <button
                            onClick={item.action}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto ${
                              item.variant === 'primary'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : item.variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {item.title}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* App Information */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-800 dark:to-dark-700 rounded-xl p-6 border border-gray-200 dark:border-dark-600 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('settings.aboutMyJobTrack')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('settings.features')}</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
              <li>• Customer Management</li>
              <li>• Job Scheduling & Tracking</li>
              <li>• Payment Management</li>
              <li>• QR Code Integration</li>
              <li>• Mobile-First Design</li>
              <li>• Offline Data Storage</li>
              <li>• Dark Mode Support</li>
              <li>• Multi-language Support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('settings.technicalInfo')}</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
              <li>• {t('settings.version')}: 1.0.0</li>
              <li>• {t('settings.dataStorage')}</li>
              <li>• {t('settings.platform')}</li>
              <li>• {t('settings.lastUpdated')}: {new Date().toLocaleDateString()}</li>
              <li>• {t('settings.builtWith')}</li>
              <li>• {t('settings.themeMode', { mode: isDark ? t('common.dark') : t('common.light') })}</li>
              <li>• Language: {language === 'en' ? t('common.english') : t('common.spanish')}</li>
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
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.clearAllData')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 text-sm mb-3">
                <strong>{t('common.warning')}:</strong> {isDemoMode 
                  ? 'This will clear your added data and restore demo data:'
                  : 'This will permanently delete:'
                }
              </p>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                {isDemoMode ? (
                  <>
                    <li>• All customers you added ({customers.filter(c => c.id.startsWith('customer-')).length})</li>
                    <li>• All jobs you created ({jobs.filter(j => j.id.startsWith('job-')).length})</li>
                    <li>• Demo data will be restored</li>
                  </>
                ) : (
                  <>
                    <li>• All {customers.length} {t('common.customers').toLowerCase()}</li>
                    <li>• All {jobs.length} {t('common.jobs').toLowerCase()}</li>
                    <li>• All payment records</li>
                    <li>• All app data</li>
                  </>
                )}
              </ul>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              {isDemoMode 
                ? 'This will clear any data you have added and restore the original demo data. The demo customers and jobs will remain for exploration.'
                : 'Make sure you have exported your data if you want to keep a backup. This action will reset the app to its initial state.'
              }
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClearAllData}
                disabled={isClearing}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isClearing ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('settings.clearAllData')}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="flex-1 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;