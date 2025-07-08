import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { useLanguage } from '@/contexts/LanguageContext';

const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            {t('landing.testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-200">
            {t('landing.testimonials.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-8 border border-transparent dark:border-dark-600 transition-colors duration-200">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic transition-colors duration-200">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">{testimonial.name}</p>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{testimonial.business}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
