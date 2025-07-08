import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Smartphone } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/UI/Logo';

// Hero section with balanced layout between text and interactive demo
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useDemo();
  const { t } = useLanguage();
  
  return (
    <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 dark:from-blue-950 dark:via-blue-900 dark:to-purple-950 overflow-hidden min-h-[85vh]" role="banner">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center md:text-left md:max-w-md">
            <div className="mb-6 inline-block md:hidden">
              <Logo 
                size="lg"
                variant="icon-only"
                theme="white"
                clickable={false}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30"
              />
            </div>
            <div className="hidden md:block mb-8">
              <Logo 
                size="xl"
                variant="horizontal"
                theme="white"
                clickable={false}
                className="backdrop-blur-sm"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
              <span itemProp="name">Simple CRM for Service Pros</span>
              <span className="sr-only">- MyJobTrack for Landscapers, Handymen & Service Professionals</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-100 mb-4 leading-relaxed drop-shadow-md">
              {t('landing.title')}
            </h2>
            <p className="text-lg text-blue-50 mb-6 drop-shadow-md">
              {t('landing.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
              <button
                onClick={() => navigate(isDemoMode ? '/login' : '/app')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center group"
              >
                {isDemoMode ? t('landing.cta.secondary') : t('landing.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="#qr-demo"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('qr-demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center group border border-white/30 hover:border-white/50"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Try Interactive Demo
              </Link>
            </div>
          </div>
          
          {/* Right Side - Interactive Demo Preview */}
          <div className="hidden md:flex justify-center items-center relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 max-w-sm">
              {/* Phone Frame */}
              <div className="bg-gray-900 rounded-xl overflow-hidden border-8 border-gray-800 shadow-inner">
                {/* App Interface Preview */}
                <div className="aspect-[9/19] relative overflow-hidden">
                  {/* App Header */}
                  <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-600 rounded-lg p-2 mr-2">
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">MyJobTrack</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 flex-1">
                    {/* Today's Jobs Section */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Today's Jobs</h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm mb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">Lawn Mowing</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">John Smith</p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Scheduled</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">Garden Cleanup</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sarah Johnson</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Completed</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-600 text-white rounded-lg p-2 text-center">
                          <p className="text-xs font-medium">Add Customer</p>
                        </div>
                        <div className="bg-green-600 text-white rounded-lg p-2 text-center">
                          <p className="text-xs font-medium">Schedule Job</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                    <div className="flex justify-around">
                      <div className="text-blue-600 dark:text-blue-400 text-center">
                        <div className="h-4 w-4 mx-auto mb-1"></div>
                        <p className="text-[10px]">Home</p>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-center">
                        <div className="h-4 w-4 mx-auto mb-1"></div>
                        <p className="text-[10px]">Customers</p>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-center">
                        <div className="h-4 w-4 mx-auto mb-1"></div>
                        <p className="text-[10px]">Jobs</p>
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-center">
                        <div className="h-4 w-4 mx-auto mb-1"></div>
                        <p className="text-[10px]">Settings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-20">
                Try Demo
              </div>
              <div className="absolute -bottom-3 -left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
                Simple & Fast
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-500/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;