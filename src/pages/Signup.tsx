import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  User,
  Building2,
  ArrowRight,
  CheckCircle,
  Users,
  ArrowLeft,
  Home
} from 'lucide-react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');

  const { signup, isAuthenticated } = useAuth();
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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSignupError('');

    try {
      const result = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.businessName || undefined
      );
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      } else {
        setSignupError(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('An unexpected error occurred. Please try again.');
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
    if (signupError) {
      setSignupError('');
    }
  };

  const benefits = [
    'Unlimited customers and jobs',
    'QR code generation and scanning',
    'Payment tracking and management',
    'Works offline on your device',
    'No monthly fees or subscriptions',
    'Data stored securely on your device'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 transition-colors duration-200">
      {/* Back to Landing Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-dark-600 hover:bg-white dark:hover:bg-dark-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <Home className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Home</span>
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-12 flex-col justify-center">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">MyJobTrack</h1>
                <p className="text-blue-100">Simple Job Tracking</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Join thousands of service providers
                </h2>
                <p className="text-blue-100 text-lg">
                  Start managing your business more efficiently with our simple, powerful tools.
                </p>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-white mr-2" />
                  <span className="text-white font-semibold">Perfect for:</span>
                </div>
                <p className="text-blue-100 text-sm">
                  Landscapers • House Cleaners • Handymen • Pool Services • 
                  Pest Control • HVAC • Plumbers • Electricians • And more!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-600 p-3 rounded-xl mr-3">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MyJobTrack</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Simple Job Tracking</p>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your Account</h2>
              <p className="text-gray-600 dark:text-gray-400">Start tracking your jobs in minutes</p>
            </div>

            {/* Signup Error */}
            {signupError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                <p className="text-red-800 dark:text-red-200 text-sm">{signupError}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={`
                      block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors bg-white dark:bg-dark-700 dark:text-white dark:border-dark-600
                      ${errors.name ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-300 hover:border-gray-400 dark:hover:border-dark-500'}
                    `}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
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

              {/* Business Name (Optional) */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Business Name <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your business name"
                    className="
                      block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-dark-600 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors bg-white dark:bg-dark-700 dark:text-white hover:border-gray-400 dark:hover:border-dark-500
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={`
                      block w-full pl-12 pr-12 py-4 text-lg border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors bg-white dark:bg-dark-700 dark:text-white dark:border-dark-600
                      ${errors.confirmPassword ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-300 hover:border-gray-400 dark:hover:border-dark-500'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400
                  text-white py-4 px-6 rounded-xl text-lg font-semibold
                  transition-colors duration-200 shadow-lg hover:shadow-xl
                  flex items-center justify-center
                  disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
                Your data is stored locally on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;