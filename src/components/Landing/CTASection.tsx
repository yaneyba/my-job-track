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
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 leading-relaxed">
            Start managing your jobs, customers, and payments today - completely free.
          </p>

          {/* Single Primary CTA */}
          <button
            onClick={() => navigate('/app')}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mx-auto group"
          >
            Get Started Free
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-gray-400 dark:text-gray-500 mt-6 text-sm">
            No credit card required • Free forever • Get started in 30 seconds
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
