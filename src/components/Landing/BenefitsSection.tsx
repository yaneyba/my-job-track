import React from 'react';
import { Smartphone, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BenefitItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const BenefitsSection: React.FC = () => {
  const { t } = useLanguage();
  
  const benefits: BenefitItem[] = [
    {
      icon: Smartphone,
      title: t('landing.benefits.mobile.title'),
      description: t('landing.benefits.mobile.description')
    },
    {
      icon: Shield,
      title: t('landing.benefits.simple.title'),
      description: t('landing.benefits.simple.description')
    },
    {
      icon: Zap,
      title: t('landing.benefits.offline.title'),
      description: t('landing.benefits.offline.description')
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            {t('landing.benefits.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
            {t('landing.benefits.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
