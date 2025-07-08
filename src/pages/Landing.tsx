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