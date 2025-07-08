import React from 'react';
import { useDemo } from '@/contexts/DemoContext';
import ShareButton from '@/components/UI/ShareButton';
import {
  NavBar,
  HeroSection,
  FeaturesSection,
  QRCodeShowcase,
  BenefitsSection,
  TestimonialsSection,
  CTASection,
  Footer,
  SchemaSEO
} from '@/components/Landing';

const Landing: React.FC = () => {
  const { isDemoMode } = useDemo();
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* Fixed Action Buttons */}
      <div className="fixed top-20 right-4 z-50 flex justify-end items-start pointer-events-none">
        {/* Share Button */}
        <ShareButton 
          variant="button" 
          size="sm" 
          className="pointer-events-auto"
        />
      </div>

      {/* Demo Badge - Bottom Floating */}
      {isDemoMode && (
        <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
          <div className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm flex items-center pointer-events-auto">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 712 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            DEMO
          </div>
        </div>
      )}
      
      {/* Structured Data for SEO */}
      <SchemaSEO />

      {/* Top Navigation Bar */}
      <NavBar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* QR Code Showcase */}
      <QRCodeShowcase />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;