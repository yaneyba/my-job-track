import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMVP } from '@/contexts/MVPContext';
import Logo from '@/components/UI/Logo';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isMVPMode } = useMVP();
  
  return (
    <header className="relative overflow-hidden" role="banner">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero.png"
          alt="MyJobTrack app interface showing job tracking, customer management, and payment features"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-purple-900/85 dark:from-blue-950/90 dark:via-blue-900/85 dark:to-purple-950/90"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Logo 
              size="xl"
              variant="icon-only"
              theme="white"
              clickable={false}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            <span itemProp="name">MyJobTrack</span>
            <span className="sr-only">- Simple CRM for Landscapers, Handymen & Service Pros</span>
          </h1>
          <h2 className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            <span className="text-green-300 font-semibold">Simple CRM</span> built for 
            <span className="font-semibold text-white"> service providers </span> 
            who value simplicity and speed.
          </h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Track jobs, manage customers, and get paid faster. <strong className="text-white">No complexity, no learning curve</strong> - 
            just what you need to run your landscaping, handyman, or contracting business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(isMVPMode ? '/login' : '/app')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center group border-2 border-green-500 hover:border-green-400"
            >
              {isMVPMode ? 'Try Demo' : 'Get Started'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-blue-100 hover:text-white px-4 py-2 text-lg font-medium transition-colors duration-200 underline decoration-2 underline-offset-4 decoration-blue-300 hover:decoration-white"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
