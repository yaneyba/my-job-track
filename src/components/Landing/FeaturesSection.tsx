import React from 'react';
import { Users, Calendar, DollarSign, QrCode } from 'lucide-react';

interface FeatureItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: Users,
      title: 'Simple Customer Tracking',
      description: 'Add customers in seconds. Track their info, job history, and payment status. No complicated forms or endless fields.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      title: 'Easy Job Scheduling',
      description: 'Schedule jobs with a few taps. See your day at a glance. Perfect for landscapers and handymen on the go.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: QrCode,
      title: 'QR Code Magic',
      description: 'Generate QR codes for job sites. Scan to instantly pull up customer info and job details. Works offline too.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: DollarSign,
      title: 'Get Paid Faster',
      description: 'Track who owes you money at a glance. Mark jobs as paid with one tap. Never lose track of payments again.',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Everything You Need to Run Your Service Business
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
            Built specifically for landscapers, cleaners, handymen, and other service providers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200 border border-transparent dark:border-dark-600">
              <div className={`${feature.color} mb-4`}>
                <feature.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
