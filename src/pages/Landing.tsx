import React from 'react';
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
  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
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