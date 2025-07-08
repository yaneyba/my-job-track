import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

// Import build info if available
let buildInfo: any = {};
try {
  // Try to import the build info - this will be generated at build time
  const { BUILD_INFO } = require('../../build-info');
  buildInfo = BUILD_INFO;
} catch (error) {
  // Fallback for development
  buildInfo = {
    buildNumber: 'dev',
    buildDate: new Date().toISOString(),
    gitBranch: 'development',
    gitHash: 'local',
    version: '1.0.0',
    environment: 'development'
  };
}

interface BuildInfoDisplayProps {
  /** Show as a badge */
  variant?: 'badge' | 'modal' | 'footer';
  /** Custom CSS classes */
  className?: string;
}

const BuildInfoDisplay: React.FC<BuildInfoDisplayProps> = ({ 
  variant = 'badge',
  className = '' 
}) => {
  const [showModal, setShowModal] = useState(false);

  const formatBuildDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getShortVersion = () => {
    // Just show v1.0.0 instead of the full build number
    return `v${buildInfo.version?.split('-')[0] || buildInfo.version || '1.0.0'}`;
  };

  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center px-2 py-1 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
          title="Click to view build information"
        >
          <Info className="h-3 w-3 mr-1" />
          {getShortVersion()}
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Build Information
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Version:</span>
                    <p className="font-mono text-gray-900 dark:text-white">{buildInfo.version}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Build:</span>
                    <p className="font-mono text-gray-900 dark:text-white break-all">{buildInfo.buildNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Branch:</span>
                    <p className="font-mono text-gray-900 dark:text-white">{buildInfo.gitBranch}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Commit:</span>
                    <p className="font-mono text-gray-900 dark:text-white">{buildInfo.gitHash}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Build Date:</span>
                    <p className="font-mono text-gray-900 dark:text-white">{formatBuildDate(buildInfo.buildDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Environment:</span>
                    <p className="font-mono text-gray-900 dark:text-white capitalize">{buildInfo.environment}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`text-xs text-center text-gray-500 dark:text-gray-400 font-mono ${className}`}>
        MyJobTrack {getShortVersion()} • Built {formatBuildDate(buildInfo.buildDate)}
      </div>
    );
  }

  // Modal variant
  return (
    <div className={`bg-gray-50 dark:bg-dark-900 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Build Information</h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Version:</span>
          <span className="font-mono text-gray-900 dark:text-white">{buildInfo.version}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Build:</span>
          <span className="font-mono text-gray-900 dark:text-white">{buildInfo.buildNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Branch:</span>
          <span className="font-mono text-gray-900 dark:text-white">{buildInfo.gitBranch}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Commit:</span>
          <span className="font-mono text-gray-900 dark:text-white">{buildInfo.gitHash}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Built:</span>
          <span className="font-mono text-gray-900 dark:text-white">{formatBuildDate(buildInfo.buildDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default BuildInfoDisplay;
