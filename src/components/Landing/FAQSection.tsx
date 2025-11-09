import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs: FAQItem[] = [
    {
      question: 'Is MyJobTrack really free?',
      answer: 'Yes! MyJobTrack is 100% free forever. No credit card required, no hidden fees, no premium tiers. We believe service professionals deserve great tools without breaking the bank.'
    },
    {
      question: 'What features are included?',
      answer: 'You get everything: customer management, job scheduling, payment tracking, QR code generation, offline support, and dark mode. All core features are available to all users.'
    },
    {
      question: 'Do I need to install anything?',
      answer: 'No installation needed! MyJobTrack is a Progressive Web App (PWA) that works in your browser. You can optionally "install" it to your phone\'s home screen for a native app experience.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Absolutely. Your data is stored securely in your browser (localStorage) or our encrypted cloud database if you choose. We never sell or share your information. You can export your data anytime.'
    },
    {
      question: 'Can I use it on multiple devices?',
      answer: 'Yes! When you create a full account, your data syncs across all your devices. The test mode uses local storage only, but you can upgrade to full sync anytime.'
    },
    {
      question: 'What about the QR scanner feature?',
      answer: 'The QR scanner is available in the full version. Test mode lets you generate QR codes, but scanning requires camera permissions available in the full app.'
    },
    {
      question: 'How do I get support?',
      answer: 'We\'re here to help! Contact us at support@myjobtrack.app or use the in-app help button. We typically respond within 24 hours.'
    },
    {
      question: 'Can I upgrade or add features later?',
      answer: 'There\'s nothing to upgrade - all features are free! We\'re constantly adding new capabilities based on user feedback. Check our roadmap in the settings.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-dark-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about MyJobTrack
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 overflow-hidden transition-colors duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're happy to help! Reach out to our support team.
          </p>
          <a
            href="mailto:support@myjobtrack.app"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            support@myjobtrack.app
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
