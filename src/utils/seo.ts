// SEO utility functions for dynamic meta tag management

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  structuredData?: Record<string, unknown>;
}

export const updateMetaTags = (seoData: SEOData) => {
  // Update title
  document.title = seoData.title;
  
  // Update meta description
  updateMetaTag('name', 'description', seoData.description);
  
  // Update keywords if provided
  if (seoData.keywords) {
    updateMetaTag('name', 'keywords', seoData.keywords);
  }
  
  // Update canonical URL if provided
  if (seoData.canonical) {
    updateLinkTag('canonical', seoData.canonical);
  }
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:title', seoData.ogTitle || seoData.title);
  updateMetaTag('property', 'og:description', seoData.ogDescription || seoData.description);
  
  if (seoData.ogImage) {
    updateMetaTag('property', 'og:image', seoData.ogImage);
  }
  
  // Update Twitter tags
  updateMetaTag('name', 'twitter:title', seoData.twitterTitle || seoData.title);
  updateMetaTag('name', 'twitter:description', seoData.twitterDescription || seoData.description);
  
  // Update structured data if provided
  if (seoData.structuredData) {
    updateStructuredData(seoData.structuredData);
  }
};

const updateMetaTag = (attribute: string, value: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};

const updateStructuredData = (data: Record<string, unknown>) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Predefined SEO data for different pages
export const seoData = {
  landing: {
    title: 'MyJobTrack - Simple CRM for Landscapers, Handymen & Service Pros',
    description: 'Simple CRM built for landscapers, handymen, contractors & service professionals. Track jobs, manage customers, and get paid faster. No complexity, just what you need to run your business.',
    keywords: 'simple CRM, landscaper software, handyman app, contractor CRM, simple job tracking, easy customer management, landscaping business software, handyman job tracker, simple service business app, easy contractor software',
    canonical: 'https://myjobtrack.app/',
    ogTitle: 'MyJobTrack - Simple CRM for Landscapers & Handymen',
    ogDescription: 'Simple CRM built for landscapers, handymen, contractors. Track jobs, manage customers, get paid faster. No complexity.',
    ogImage: 'https://myjobtrack.app/og-image.png'
  },
  
  dashboard: {
    title: 'Dashboard - MyJobTrack Simple CRM',
    description: 'Your simple business dashboard. See today\'s jobs, customer info, and payment status at a glance. Built for landscapers, handymen, and contractors.',
    keywords: 'simple business dashboard, landscaper dashboard, handyman job overview, contractor CRM dashboard',
    canonical: 'https://myjobtrack.app/app/dashboard'
  },
  
  customers: {
    title: 'Customer Management - Simple CRM for Service Pros',
    description: 'Simple customer management for landscapers and handymen. Add customers in seconds, track job history, manage contact info. No complexity.',
    keywords: 'simple customer management, landscaper customer tracking, handyman client database, easy contact management',
    canonical: 'https://myjobtrack.app/app/customers'
  },
  
  jobs: {
    title: 'Job Tracking - Simple Scheduling for Landscapers & Handymen', 
    description: 'Easy job scheduling and tracking for landscapers, handymen, and contractors. Schedule jobs in minutes, track progress, manage work orders.',
    keywords: 'simple job scheduling, landscaper job tracking, handyman work orders, contractor job management, easy scheduling',
    canonical: 'https://myjobtrack.app/app/jobs'
  },
  
  payments: {
    title: 'Payment Tracking - Get Paid Faster | MyJobTrack',
    description: 'Simple payment tracking for service professionals. See who owes you money, mark jobs as paid, never lose track of payments. Built for landscapers and handymen.',
    keywords: 'simple payment tracking, landscaper invoicing, handyman payments, contractor billing, get paid faster',
    canonical: 'https://myjobtrack.app/app/payments'
  },
  
  login: {
    title: 'Login - MyJobTrack',
    description: 'Access your MyJobTrack account to manage your service business, track jobs, and handle customer relationships.',
    keywords: 'login, access account, service business login',
    canonical: 'https://myjobtrack.app/login'
  },
  
  signup: {
    title: 'Sign Up - MyJobTrack',
    description: 'Create your MyJobTrack account and start managing your service business with professional job tracking, customer management, and payment tracking.',
    keywords: 'sign up, create account, service business software',
    canonical: 'https://myjobtrack.app/signup'
  }
};

// Hook for using SEO in React components
export const useSEO = (pageKey: keyof typeof seoData) => {
  const applyPageSEO = () => {
    const pageSEO = seoData[pageKey];
    if (pageSEO) {
      updateMetaTags(pageSEO);
    }
  };
  
  return { applyPageSEO };
};
