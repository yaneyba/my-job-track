import React, { createContext, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useDemo } from './DemoContext';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { AnalyticsEvent } from '@/types';

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => Promise<void>;
  trackPageView: (page?: string) => void;
  trackConversion: (source: string, email?: string) => void;
  trackWaitlistCTA: (source: string, properties?: Record<string, any>) => void;
  trackFeatureInteraction: (feature: string, action: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { isDemoMode } = useDemo();
  const { user } = useAuth();
  const location = useLocation();
  const dataProvider = DataProviderFactory.getInstance();

  // Get session ID (create if doesn't exist)
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('myjobtrack_analytics_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('myjobtrack_analytics_session', sessionId);
      localStorage.setItem('myjobtrack_session_start', new Date().toISOString());
      
      // Initialize session in database
      initializeSession(sessionId);
    }
    return sessionId;
  }, []);

  // Determine user type for analytics
  const getUserType = useCallback(() => {
    if (user?.isWaitlisted) return 'waitlisted';
    if (user?.id && !isDemoMode) return 'authenticated';
    if (isDemoMode) return 'demo';
    return 'anonymous';
  }, [user, isDemoMode]);

  // Core tracking function
  const trackEvent = useCallback(async (event: string, properties: Record<string, any> = {}) => {
    try {
      const sessionStart = localStorage.getItem('myjobtrack_session_start');
      const sessionDuration = sessionStart 
        ? Math.floor((Date.now() - new Date(sessionStart).getTime()) / 1000)
        : 0;

      const analyticsEvent: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          page: location.pathname,
          sessionDuration,
          timestamp: new Date().toISOString(),
        },
        userId: user?.id,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        demoMode: isDemoMode,
        userType: getUserType(),
      };

      // Console logging for development
      console.log('📊 Analytics Event:', analyticsEvent);

      // Store event locally for backup/debugging
      const events = JSON.parse(localStorage.getItem('myjobtrack_analytics_events') || '[]');
      events.push(analyticsEvent);
      
      // Keep only last 50 events to prevent storage bloat
      if (events.length > 50) {
        events.splice(0, events.length - 50);
      }
      
      localStorage.setItem('myjobtrack_analytics_events', JSON.stringify(events));

      // Send to analytics via data provider
      await dataProvider.trackEvent(analyticsEvent);

      // TODO: Also send to external analytics service (Google Analytics, Mixpanel, etc.)
      // Example: gtag('event', event, properties);

    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [isDemoMode, user, location, getSessionId, getUserType, dataProvider]);

  // Track page views automatically
  const trackPageView = useCallback((page?: string) => {
    const currentPage = page || location.pathname;
    trackEvent('page_view', {
      page: currentPage,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, [location.pathname, trackEvent]);

  // Track conversion events
  const trackConversion = useCallback((source: string, email?: string) => {
    trackEvent('waitlist_signup_completed', {
      source,
      email_domain: email ? email.split('@')[1] : undefined,
      conversion_completed: true,
      conversion_timestamp: new Date().toISOString(),
    });
  }, [trackEvent]);

  // Track waitlist CTA triggers
  const trackWaitlistCTA = useCallback((source: string, properties: Record<string, any> = {}) => {
    trackEvent('waitlist_cta_triggered', {
      source,
      trigger_timestamp: new Date().toISOString(),
      ...properties,
    });
  }, [trackEvent]);

  // Track feature interactions
  const trackFeatureInteraction = useCallback((feature: string, action: string, properties: Record<string, any> = {}) => {
    trackEvent('feature_interaction', {
      feature,
      action,
      feature_category: categorizeFeature(feature),
      ...properties,
    });
  }, [trackEvent]);

  // Initialize or update session via data provider
  const initializeSession = useCallback(async (sessionId: string) => {
    try {
      await dataProvider.initializeSession({
        sessionId,
        userId: user?.id,
        demoMode: isDemoMode,
        userType: getUserType(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        landingPage: window.location.pathname,
      });
    } catch (error) {
      console.warn('Session initialization error:', error);
    }
  }, [dataProvider, user?.id, isDemoMode, getUserType]);

  // Auto-track page views on route changes
  useEffect(() => {
    trackPageView();
  }, [location.pathname, trackPageView]);

  return (
    <AnalyticsContext.Provider value={{
      trackEvent,
      trackPageView,
      trackConversion,
      trackWaitlistCTA,
      trackFeatureInteraction,
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Helper function to categorize features
function categorizeFeature(feature: string): string {
  if (feature.includes('customer')) return 'customer_management';
  if (feature.includes('job')) return 'job_management';
  if (feature.includes('qr')) return 'qr_features';
  if (feature.includes('theme') || feature.includes('language')) return 'settings';
  if (feature.includes('navigation') || feature.includes('menu')) return 'navigation';
  return 'other';
}

export default AnalyticsProvider;
