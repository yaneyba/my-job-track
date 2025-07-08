import { useState } from 'react';
import { Mail, Users, CheckCircle, X, AlertCircle } from 'lucide-react';
import { LocalStorageDataProvider } from '@/data/providers/LocalStorageDataProvider';

interface WaitlistSignupProps {
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function WaitlistSignup({ onSuccess, onError, className = '' }: WaitlistSignupProps) {
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add to local storage waitlist
      LocalStorageDataProvider.addToWaitlistStorage(email);
      
      // For demonstration, we'll also allow immediate testing
      setSuccess(true);
      setEmail('');
      setBusinessType('');
      
      onSuccess?.(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join waitlist';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTestApp = () => {
    // Set user as waitlisted and allow testing
    localStorage.setItem('jobtrack_current_user', JSON.stringify({
      id: 'waitlist-user',
      email,
      name: 'Test User',
      businessName: businessType || 'Test Business',
      createdAt: new Date().toISOString(),
      isWaitlisted: true
    }));

    // Redirect to app
    window.location.href = '/app';
  };

  if (success) {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            Welcome to the Waitlist!
          </h3>
        </div>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Thanks for joining! While you wait for the full release, you can test the app with sample data. 
          All your test data will be saved locally in your browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleTestApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Test the App Now
          </button>
          <button
            onClick={() => setSuccess(false)}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Sign Up Another Email
          </button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> This is a testing environment. Your data is stored locally in your browser 
              and won't be available on other devices. The QR scanner feature is disabled in test mode.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Join the Waitlist & Test Now
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get early access and start testing the app immediately with sample data stored locally in your browser.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center">
          <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Business Type (Optional)
          </label>
          <input
            type="text"
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            placeholder="e.g., Cleaning Service, Landscaping, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Joining Waitlist...
            </>
          ) : (
            'Join Waitlist & Test App'
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        By joining, you agree to receive updates about the app launch. You can unsubscribe at any time.
      </div>
    </div>
  );
}
