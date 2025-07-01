import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { forceClearCacheAndReload, checkForUpdates } from '@/utils/cacheBuster';

export default function CacheManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Cache Management
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p className="font-medium mb-1">About Cache Management</p>
            <p>
              If you're seeing outdated content or the app isn't working properly, 
              clearing the cache can help. This will remove all stored data and reload the app.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckUpdates}
            disabled={isChecking}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Check for Updates'}
          </button>

          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${isClearing ? 'animate-spin' : ''}`} />
            {isClearing ? 'Clearing...' : 'Clear Cache & Reload'}
          </button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>Version: {__PACKAGE_VERSION__ || '1.0.0'}</p>
          <p>Build: {new Date(__BUILD_TIME__ || Date.now()).toLocaleString()}</p>
          <p>Cache: SW v2 + File Hashing</p>
        </div>
      </div>
    </div>
  );
}
