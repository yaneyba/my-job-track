import React from 'react';
import { Smartphone, Shield, Zap } from 'lucide-react';

interface BenefitItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const BenefitsSection: React.FC = () => {
  const benefits: BenefitItem[] = [
    {
      icon: Smartphone,
      title: 'Built for Your Phone',
      description: 'Large buttons, simple navigation. Use it with gloves on. Works great even in bright sunlight.'
    },
    {
      icon: Shield,
      title: 'No Learning Curve',
      description: 'If you can text, you can use MyJobTrack. Set up in 5 minutes. Start tracking jobs immediately.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add customers in 30 seconds. Schedule jobs in 1 minute. Built for busy landscapers and handymen.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Why Service Providers Love MyJobTrack
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
            Designed by service providers, for service providers. Simple, fast, and effective.
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
