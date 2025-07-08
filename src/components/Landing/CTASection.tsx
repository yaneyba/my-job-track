import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import WaitlistSignup from './WaitlistSignup';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useDemo();
  const { t } = useLanguage();
  const [showWaitlist, setShowWaitlist] = useState(false);
  
  const handleWaitlistSuccess = (email: string) => {
    console.log('User joined waitlist:', email);
    // Additional tracking or analytics can go here
  };

  const handleWaitlistError = (error: string) => {
    console.error('Waitlist signup error:', error);
    // Additional error handling can go here
  };
  
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-950 dark:to-dark-900">
      <div className="max-w-4xl mx-auto px-4">
        {!showWaitlist ? (
          <div className="text-center">
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
              
              {!isDemoMode && (
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Join Waitlist & Test Now
                </button>
              )}
            </div>
            
            <p className="text-gray-400 dark:text-gray-500 mt-4">
              {isDemoMode ? t('landing.cta.demoNote') : 'Get early access and test the app with local data storage'}
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Test Job Track?
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-400">
                Join our waitlist and start testing immediately with local data storage.
              </p>
            </div>
            
            <WaitlistSignup
              onSuccess={handleWaitlistSuccess}
              onError={handleWaitlistError}
            />
            
            <div className="text-center mt-6">
              <button
                onClick={() => setShowWaitlist(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to main page
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;
