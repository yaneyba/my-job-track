import React from 'react';
import Logo from '@/components/UI/Logo';
import { BUILD_INFO } from '@/build-info';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-950 py-12 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo 
              size="md"
              variant="horizontal"
              theme="white"
              clickable={false}
            />
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-center md:text-right transition-colors duration-200">
            <p>Built for service providers who value simplicity and speed.</p>
            <p className="mt-1">© 2024 MyJobTrack. All rights reserved.</p>
          </div>
        </div>
        {/* Build hash - bottom left corner */}
        <div className="absolute bottom-2 left-4 text-xs text-gray-600 opacity-50">
          {BUILD_INFO.gitHash}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
