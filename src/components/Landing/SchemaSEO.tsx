import React from 'react';

const SchemaSEO: React.FC = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "MyJobTrack",
          "url": "https://myjobtrack.app",
          "description": "Simple CRM software built for service professionals, landscapers, handymen, contractors and more. Easy job tracking, customer management, and payment tracking without the complexity.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Any",
          "creator": {
            "@type": "Organization",
            "name": "MyJobTrack"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Landscapers, Handymen, Contractors, Service Professionals"
          }
        })
      }}
    />
  );
};

export default SchemaSEO;
