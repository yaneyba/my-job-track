// Analytics interfaces for user engagement tracking

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  demoMode: boolean;
  userType: 'demo' | 'waitlisted' | 'authenticated' | 'anonymous';
}

export interface SessionInitData {
  sessionId: string;
  userId?: string;
  demoMode: boolean;
  userType: string;
  referrer?: string;
  userAgent?: string;
  landingPage?: string;
}

export interface AnalyticsQuery {
  query: string;
  timeframe: string;
  filters?: Record<string, any>;
}

export interface ConversionRate {
  conversion_source: string;
  total_sessions: number;
  conversions: number;
  conversion_rate: number;
}

export interface FeatureUsage {
  feature_name: string;
  feature_category: string;
  usage_count: number;
  unique_sessions: number;
}

export interface DemoEngagement {
  date: string;
  sessions: number;
  avg_duration: number;
  avg_page_views: number;
  conversions: number;
  conversion_rate: number;
}

export interface UserJourney {
  pages_visited: string;
  session_count: number;
  avg_duration: number;
  conversions: number;
}

// Analytics dashboard data structure
export interface AnalyticsDashboardData {
  conversionRates: ConversionRate[];
  popularFeatures: FeatureUsage[];
  demoEngagement: DemoEngagement[];
  userJourneys: UserJourney[];
}

// Session management
export interface UserSession {
  sessionId: string;
  userId?: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  demoMode: boolean;
  userType: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  country?: string;
  pageViews: number;
  eventsCount: number;
  featuresUsed: string[];
  converted: boolean;
  conversionEvent?: string;
  conversionSource?: string;
  waitlistEmail?: string;
  landingPage?: string;
  exitPage?: string;
  pagesVisited: string[];
}

// Event categories for analytics
export type EventCategory = 
  | 'navigation' 
  | 'feature_interaction' 
  | 'demo_mode' 
  | 'conversion' 
  | 'user_action'
  | 'form_interaction'
  | 'qr_interaction'
  | 'other';

// Conversion funnel steps
export interface FunnelStep {
  id: string;
  sessionId: string;
  funnelStep: 'landing' | 'demo_entry' | 'feature_use' | 'waitlist_cta' | 'signup';
  stepOrder: number;
  timestamp: string;
  stepProperties?: Record<string, any>;
  timeFromPreviousStep?: number;
}

// A/B testing support
export interface ABTestVariant {
  id: string;
  sessionId: string;
  testName: string;
  variantName: string;
  assignedAt: string;
}
