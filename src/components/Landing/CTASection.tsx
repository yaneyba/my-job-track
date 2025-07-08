import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useDemo();
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-950 dark:to-dark-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          {t('landing.cta.title')}
        </h2>
        <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 leading-relaxed">
          {t('landing.cta.description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(isDemoMode ? '/login' : '/app')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center group"
          >
            {isDemoMode ? t('landing.cta.demo') : t('landing.cta.start')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-400 dark:text-gray-500">
            {isDemoMode ? t('landing.cta.demoNote') : t('landing.cta.signupNote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
