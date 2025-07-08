import { useState } from 'react';
import { TestTube, X, Info, Database } from 'lucide-react';
import { LocalStorageDataProvider } from '@/data/providers/LocalStorageDataProvider';

interface WaitlistTestBannerProps {
  className?: string;
}

export default function WaitlistTestBanner({ className = '' }: WaitlistTestBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  const storageSize = LocalStorageDataProvider.getWaitlistStorageSize();

  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TestTube className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">
                🧪 Test Mode Active - You're testing Job Track!
              </div>
              <div className="text-sm text-purple-100 mt-1">
                Your data is stored locally in your browser. 
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="underline hover:no-underline ml-1"
                >
                  {showDetails ? 'Hide details' : 'Learn more'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-purple-100 hidden sm:block">
              Data stored: {storageSize}
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-purple-100 hover:text-white transition-colors p-1"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-3 border-t border-purple-300/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="font-medium">What's available in test mode:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-6 text-purple-100">
                  <li>Add, edit, and delete customers</li>
                  <li>Schedule and manage jobs</li>
                  <li>View dashboard and statistics</li>
                  <li>Generate mock QR codes</li>
                  <li>Test all app features</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  <span className="font-medium">Test mode limitations:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-6 text-purple-100">
                  <li>Data only available in this browser</li>
                  <li>QR scanner is disabled</li>
                  <li>No cloud synchronization</li>
                  <li>Data cleared if browser storage is cleared</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
              <p className="text-sm text-purple-100">
                <strong>Ready for the real thing?</strong> When the full version launches, 
                you'll be able to migrate your test data and access advanced features like 
                cloud sync, mobile scanning, and team collaboration.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
