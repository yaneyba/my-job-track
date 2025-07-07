import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { forceClearCacheAndReload, checkForUpdates } from '@/utils/cacheBuster';
import { useDemo } from '@/contexts/DemoContext';

export default function CacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const useApiProvider = import.meta.env.VITE_USE_API_PROVIDER === 'true';
  const { isDemoMode } = useDemo();
  
  // If using API provider, don't render the component
  if (useApiProvider) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 transition-colors duration-200">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 transition-colors duration-200" />
          <div className="text-sm text-amber-700 dark:text-amber-300 transition-colors duration-200">
            <p className="font-medium mb-1">Cache management is disabled in API mode</p>
            <p className="leading-relaxed">
              When using the API provider, cache management is handled automatically by the server.
              {isDemoMode && " In Demo mode, data is stored on the server for demonstration purposes."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleClearCache = async () => {
    if (confirm('This will clear all cached data and reload the app. Continue?')) {
      setIsClearing(true);
      try {
        await forceClearCacheAndReload();
      } catch (error) {
        console.error('Error clearing cache:', error);
        setIsClearing(false);
      }
    }
  };

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    try {
      const hasUpdate = await checkForUpdates();
      if (hasUpdate) {
        alert('New version detected! Cache will be cleared automatically.');
        await forceClearCacheAndReload();
      } else {
        alert('You are running the latest version.');
      }
    } catch (error) {
      console.error('Error checking updates:', error);
      alert('Error checking for updates. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-dark-700 transition-colors duration-200">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 transition-colors duration-200">
        Cache Management
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 lg:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors duration-200">
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 transition-colors duration-200" />
          <div className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 transition-colors duration-200 min-w-0">
            <p className="font-medium mb-1">About Cache Management</p>
            <p className="leading-relaxed">
              If you're seeing outdated content or the app isn't working properly, 
              clearing the cache can help. This will remove all stored data and reload the app.
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="w-full flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px]"
          >
            <RotateCcw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 ${isChecking ? 'animate-spin' : ''}`} />
            <span className="truncate">{isChecking ? 'Checking...' : 'Check for Updates'}</span>
          </button>

          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="w-full flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-xs sm:text-sm font-medium disabled:cursor-not-allowed transition-colors duration-200 min-h-[44px]"
          >
            <RotateCcw className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 ${isClearing ? 'animate-spin' : ''}`} />
            <span className="truncate">{isClearing ? 'Clearing...' : 'Clear Cache & Reload'}</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 transition-colors duration-200">
          <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <p className="truncate">Version: {__PACKAGE_VERSION__ || '1.0.0'}</p>
            <p className="truncate">Build: {new Date(__BUILD_TIME__ || Date.now()).toLocaleDateString()}</p>
          </div>
          <p className="truncate">Cache: SW v2 + File Hashing</p>
        </div>
      </div>
    </div>
  );
}