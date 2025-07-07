import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ size = 'md' }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3 text-base'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`${sizeClasses[size]} text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors flex items-center space-x-1`}
      title={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
    >
      <Globe className={iconSizes[size]} />
      <span className="font-medium uppercase">
        {language === 'en' ? 'EN' : 'ES'}
      </span>
    </button>
  );
};

export default LanguageToggle;
