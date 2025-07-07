import React from 'react';
import { useMVP } from '@/contexts/MVPContext';
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
  const { isMVPMode } = useMVP();
  
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* MVP Badge */}
      {isMVPMode && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
          MVP
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