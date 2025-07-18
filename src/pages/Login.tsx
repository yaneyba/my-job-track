import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/UI/Logo';
import { 
  Calendar,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Users,
  DollarSign,
  QrCode
} from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const { isDemoMode } = useDemo();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      } else {
        setLoginError(result.error || t('auth.loginError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleDemoFill = () => {
    setFormData({
      email: import.meta.env.VITE_DEMO_EMAIL,
      password: import.meta.env.VITE_DEMO_PASSWORD
    });
    // Clear any existing errors
    setErrors({});
    setLoginError('');
  };

  const features = [
    {
      icon: Users,
      title: t('auth.features.customers'),
      description: t('auth.features.customersDesc')
    },
    {
      icon: Calendar,
      title: t('auth.features.jobs'),
      description: t('auth.features.jobsDesc')
    },
    {
      icon: QrCode,
      title: t('auth.features.qr'),
      description: t('auth.features.qrDesc')
    },
    {
      icon: DollarSign,
      title: t('auth.features.payments'),
      description: t('auth.features.paymentsDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-200">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-center">
          <div className="max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <Logo 
                size="lg" 
                variant="horizontal" 
                theme="white" 
                showTagline={true}
                tagline="Simple Job Tracking"
                clickable={true}
              />
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('auth.leftSideTitle')}
                </h2>
                <p className="text-blue-100 text-lg">
                  {t('auth.leftSideSubtitle')}
                </p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-lg mr-4 mt-1">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>{t('auth.leftSideFeatures')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Logo 
                size="lg" 
                variant="horizontal" 
                theme="colored" 
                showTagline={true}
                tagline="Simple Job Tracking"
                clickable={true}
                className="justify-center"
              />
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.welcomeBack')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('auth.signInToAccount')}</p>
            </div>

            {/* Login Error */}
            {loginError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-200 text-sm">{loginError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className={`
                      block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors bg-white dark:bg-dark-700 dark:text-white dark:border-dark-600
                      ${errors.email ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-300 hover:border-gray-400 dark:hover:border-dark-500'}
                    `}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className={`
                      block w-full pl-12 pr-12 py-4 text-lg border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors bg-white dark:bg-dark-700 dark:text-white dark:border-dark-600
                      ${errors.password ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-300 hover:border-gray-400 dark:hover:border-dark-500'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                  text-white py-4 px-6 rounded-xl text-lg font-semibold
                  transition-colors duration-200 shadow-lg hover:shadow-xl
                  flex items-center justify-center
                  disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('auth.signingIn')}
                  </>
                ) : (
                  <>
                    {t('auth.signIn')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link - Hidden in Demo mode */}
            {!isDemoMode && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t('auth.noAccount')}{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                  >
                    {t('auth.signUp')}
                  </Link>
                </p>
              </div>
            )}

            {/* Demo Account Info */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                {t('auth.demo.title')}
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                {t('auth.demo.description')}
              </p>
              <div className="bg-white dark:bg-dark-700 rounded p-3 text-sm mb-3">
                <p className="text-gray-700 dark:text-gray-300"><strong>{t('auth.email')}:</strong> {import.meta.env.VITE_DEMO_EMAIL}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>{t('auth.password')}:</strong> {import.meta.env.VITE_DEMO_PASSWORD}</p>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {t('auth.demo.autoFill')}
              </button>
            </div>

            {/* Back to Landing Link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors duration-200"
              >
                ← {t('auth.backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;