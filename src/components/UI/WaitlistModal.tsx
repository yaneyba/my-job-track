import React, { useState } from 'react';
import { X, Mail, Briefcase, ArrowRight, CheckCircle, Star, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { waitlistService, WaitlistSubmission } from '@/services/waitlist';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create waitlist submission data
      const submission: WaitlistSubmission = {
        email: email.trim(),
        businessType: businessType.trim() || undefined,
        source: 'demo-mode'
      };
      
      // Call the waitlist service
      const response = await waitlistService.addToWaitlist(submission);
      
      if (response.success) {
        setIsSuccess(true);
        
        // Auto-close after showing success
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setEmail('');
          setBusinessType('');
        }, 2500);
      } else {
        setError(response.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Star className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">{t('demo.waitlist.title')}</h2>
          </div>
          <p className="text-blue-100 text-sm">{t('demo.waitlist.subtitle')}</p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('demo.waitlist.joinSuccess')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('demo.waitlist.benefits')}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {t('demo.waitlist.description')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('demo.waitlist.email')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="waitlist-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('demo.waitlist.emailPlaceholder')}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                {/* Business Type Input */}
                <div>
                  <label htmlFor="waitlist-business" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('demo.waitlist.businessType')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="waitlist-business"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      placeholder={t('demo.waitlist.businessTypePlaceholder')}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    ✨ {t('demo.waitlist.benefits')}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    {t('demo.waitlist.later')}
                  </button>
                  <button
                    type="submit"
                    disabled={!email.trim() || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        {t('demo.waitlist.joinButton')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;
