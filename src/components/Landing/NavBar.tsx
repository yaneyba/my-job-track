import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from '@/components/UI/ThemeToggle';
import LanguageToggle from '@/components/UI/LanguageToggle';
import Logo from '@/components/UI/Logo';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <nav className="relative z-10 bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-dark-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo 
            size="md"
            variant="horizontal"
            theme="colored"
            clickable={false}
          />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* Language Toggle */}
            <LanguageToggle size="sm" />
            
            {/* Sign In Button */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center px-2 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 border border-gray-300 dark:border-dark-600 hover:border-blue-300 dark:hover:border-blue-500 rounded-lg"
            >
              <LogIn className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('nav.signIn')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
