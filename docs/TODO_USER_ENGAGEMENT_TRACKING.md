# User Engagement Click Tracking - TODO

## 🎯 Objective
Implement comprehensive click tracking to understand user behavior in demo mode and optimize conversion rates for the waitlist CTA.

## 📊 Why User Engagement Tracking?
- **Conversion Optimization**: Understand which features users interact with most
- **Demo Mode Insights**: See where users spend time before hitting waitlist CTAs
- **Product Validation**: Identify most valuable features for actual users
- **User Journey Mapping**: Track path from landing → demo → waitlist signup
- **A/B Testing Data**: Foundation for testing different CTAs and flows

## 🔍 Click Events to Track

### 1. **Navigation & Page Views**
- [ ] Landing page sections (Features, Benefits, CTA)
- [ ] Demo mode entry (from landing page)
- [ ] Page transitions within app (Dashboard → Customers → Jobs, etc.)
- [ ] Breadcrumb navigation clicks
- [ ] Menu/sidebar navigation

### 2. **Core Feature Interactions**
- [ ] **Customer Management**:
  - [ ] "Add Customer" button clicks
  - [ ] Customer card clicks (view details)
  - [ ] Customer search/filter usage
  - [ ] Edit customer button clicks
  - [ ] Customer form field interactions
  
- [ ] **Job Management**:
  - [ ] "Schedule Job" button clicks
  - [ ] Job card clicks (view details)
  - [ ] Job status updates
  - [ ] Job search/filter usage
  - [ ] Edit job button clicks
  - [ ] Job form field interactions

- [ ] **QR Code Features**:
  - [ ] "Scan QR Code" button clicks
  - [ ] QR scanner activation
  - [ ] QR code generation requests
  - [ ] Successful QR scans (before waitlist CTA)

### 3. **Demo Mode Specific Events**
- [ ] **Waitlist CTA Triggers**:
  - [ ] Save customer form → waitlist CTA
  - [ ] Save job form → waitlist CTA
  - [ ] QR scan success → waitlist CTA
  - [ ] Edit customer save → waitlist CTA
  - [ ] Edit job save → waitlist CTA

- [ ] **Waitlist Modal Interactions**:
  - [ ] Modal open events (with source: "add_customer", "qr_scan", etc.)
  - [ ] Email field focus/typing
  - [ ] Business type dropdown usage
  - [ ] "Join Waitlist" button clicks
  - [ ] Modal close/dismiss events
  - [ ] Form validation errors

### 4. **User Experience Events**
- [ ] **Theme & Settings**:
  - [ ] Dark/light mode toggles
  - [ ] Language switches (EN/ES)
  - [ ] Settings page interactions

- [ ] **Help & Information**:
  - [ ] Demo mode info banner interactions
  - [ ] Help tooltip clicks
  - [ ] Feature explanation views

## 🛠 Implementation Strategy

### Phase 1: Analytics Foundation
- [ ] **Choose Analytics Service**:
  - [ ] Google Analytics 4 (free, comprehensive)
  - [ ] Mixpanel (event-focused, good free tier)
  - [ ] PostHog (open source, privacy-friendly)
  - [ ] Custom analytics (Cloudflare Workers + D1)

- [ ] **Create Analytics Context**:
  ```typescript
  // src/contexts/AnalyticsContext.tsx
  interface AnalyticsEvent {
    event: string;
    properties: Record<string, any>;
    userId?: string;
    timestamp: string;
  }
  ```

- [ ] **Environment Setup**:
  - [ ] Add analytics service API keys to environment
  - [ ] Configure tracking only in production (optional for dev)
  - [ ] Implement privacy-compliant tracking

### Phase 2: Core Event Tracking
- [ ] **Page View Tracking**:
  ```typescript
  // Auto-track route changes
  useEffect(() => {
    analytics.track('page_view', {
      page: location.pathname,
      demo_mode: isDemoMode,
      timestamp: new Date().toISOString()
    });
  }, [location]);
  ```

- [ ] **Click Event Wrapper**:
  ```typescript
  // src/hooks/useTrackClick.ts
  const useTrackClick = (eventName: string, properties?: object) => {
    return (additionalProps?: object) => {
      analytics.track(eventName, {
        ...properties,
        ...additionalProps,
        demo_mode: isDemoMode,
        timestamp: new Date().toISOString()
      });
    };
  };
  ```

### Phase 3: Demo Mode Specific Tracking
- [ ] **Waitlist CTA Performance**:
  ```typescript
  // Track which features trigger most waitlist signups
  analytics.track('waitlist_cta_triggered', {
    source: 'add_customer' | 'edit_job' | 'qr_scan',
    demo_mode: true,
    user_session_duration: sessionTime,
    pages_viewed: pagesInSession,
    features_used: featuresInteracted
  });
  ```

- [ ] **Conversion Funnel**:
  ```typescript
  // Track full conversion path
  analytics.track('waitlist_signup_completed', {
    source: triggerSource,
    time_to_conversion: timeFromFirstVisit,
    interactions_before_signup: clickCount,
    email_domain: emailDomain,
    business_type: selectedBusinessType
  });
  ```

### Phase 4: Advanced Insights
- [ ] **Heatmap Integration**:
  - [ ] Hotjar or Microsoft Clarity
  - [ ] Focus on demo mode pages
  - [ ] A/B testing setup

- [ ] **Custom Dashboards**:
  - [ ] Demo mode engagement metrics
  - [ ] Conversion rate by feature
  - [ ] User journey visualization
  - [ ] Geographic and device insights

## 📈 Key Metrics to Monitor

### Engagement Metrics
- [ ] **Page Views per Session**: How deeply users explore
- [ ] **Feature Usage**: Which features get most interaction
- [ ] **Time to Waitlist CTA**: How long before users hit restrictions
- [ ] **Bounce Rate by Page**: Where users drop off

### Conversion Metrics
- [ ] **Waitlist CTA Conversion Rate**: By trigger source
- [ ] **Email Signup Rate**: CTA → actual signup
- [ ] **Feature-to-Conversion**: Which features lead to signups
- [ ] **Session-to-Conversion**: First visit → waitlist signup

### User Behavior Insights
- [ ] **Most Popular User Flows**: Common navigation patterns
- [ ] **Feature Stickiness**: Repeat usage of features
- [ ] **Drop-off Points**: Where users leave the demo
- [ ] **Device & Browser Patterns**: Optimization opportunities

## 🔧 Technical Implementation

### Database Schema for Custom Analytics

If implementing custom analytics with Cloudflare Workers + D1:

```sql
-- User engagement events table
CREATE TABLE IF NOT EXISTS engagement_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,  -- Optional, for authenticated users
    event_name TEXT NOT NULL,
    event_category TEXT,  -- 'navigation', 'feature_interaction', 'demo_mode', 'conversion'
    page_path TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Event properties (JSON)
    properties TEXT,  -- JSON string with event-specific data
    
    -- User context
    demo_mode BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    
    -- Session data
    session_duration INTEGER,  -- Seconds since session start
    page_views_in_session INTEGER,
    
    -- Conversion tracking
    conversion_source TEXT,  -- 'add_customer', 'qr_scan', etc.
    converted BOOLEAN DEFAULT FALSE,
    
    -- Indexes for common queries
    INDEX idx_session_id (session_id),
    INDEX idx_event_name (event_name),
    INDEX idx_timestamp (timestamp),
    INDEX idx_demo_mode (demo_mode),
    INDEX idx_converted (converted)
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    duration INTEGER,  -- Total session duration in seconds
    
    -- Session metadata
    demo_mode BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    country TEXT,  -- From Cloudflare geolocation
    
    -- Session metrics
    page_views INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    features_used TEXT,  -- JSON array of features interacted with
    
    -- Conversion data
    converted BOOLEAN DEFAULT FALSE,
    conversion_event TEXT,  -- Final event that led to conversion
    conversion_source TEXT,  -- Which feature triggered waitlist CTA
    waitlist_email TEXT,  -- If user joined waitlist
    
    -- Journey data
    landing_page TEXT,
    exit_page TEXT,
    pages_visited TEXT,  -- JSON array of pages visited
    
    INDEX idx_started_at (started_at),
    INDEX idx_demo_mode (demo_mode),
    INDEX idx_converted (converted)
);

-- Conversion funnel analysis table
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    funnel_step TEXT NOT NULL,  -- 'landing', 'demo_entry', 'feature_use', 'waitlist_cta', 'signup'
    step_order INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Step-specific data
    step_properties TEXT,  -- JSON with step-specific information
    time_from_previous_step INTEGER,  -- Seconds from previous step
    
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id),
    INDEX idx_session_funnel (session_id, step_order),
    INDEX idx_funnel_step (funnel_step)
);

-- A/B testing variants table (for future use)
CREATE TABLE IF NOT EXISTS ab_test_variants (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id),
    INDEX idx_test_variant (test_name, variant_name)
);
```

### Analytics Service Integration
```typescript
// src/services/analytics.ts
export class AnalyticsService {
  private db: D1Database;
  
  constructor(db: D1Database) {
    this.db = db;
  }
  
  async track(event: string, properties: Record<string, any>) {
    const eventData = {
      id: crypto.randomUUID(),
      session_id: this.getSessionId(),
      event_name: event,
      event_category: this.categorizeEvent(event),
      page_path: window.location.pathname,
      properties: JSON.stringify(properties),
      demo_mode: properties.demo_mode || false,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    await this.db.prepare(`
      INSERT INTO engagement_events 
      (id, session_id, event_name, event_category, page_path, properties, demo_mode, user_agent, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      eventData.id, eventData.session_id, eventData.event_name, 
      eventData.event_category, eventData.page_path, eventData.properties,
      eventData.demo_mode, eventData.user_agent, eventData.timestamp
    ).run();
  }
  
  async startSession(referrer?: string) {
    const sessionId = crypto.randomUUID();
    await this.db.prepare(`
      INSERT INTO user_sessions (session_id, referrer, demo_mode, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).bind(sessionId, referrer, false, navigator.userAgent, 'unknown').run();
    
    localStorage.setItem('analytics_session_id', sessionId);
    return sessionId;
  }
  
  async endSession() {
    const sessionId = this.getSessionId();
    if (!sessionId) return;
    
    await this.db.prepare(`
      UPDATE user_sessions 
      SET ended_at = CURRENT_TIMESTAMP,
          duration = (strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', started_at))
      WHERE session_id = ?
    `).bind(sessionId).run();
  }
  
  private getSessionId(): string {
    return localStorage.getItem('analytics_session_id') || this.startSession();
  }
  
  private categorizeEvent(event: string): string {
    if (event.includes('page_view') || event.includes('navigation')) return 'navigation';
    if (event.includes('waitlist') || event.includes('signup')) return 'conversion';
    if (event.includes('demo')) return 'demo_mode';
    return 'feature_interaction';
  }
}

// Custom Analytics Hook
export const useAnalytics = () => {
  const analytics = new AnalyticsService(env.DB);
  const { isDemoMode } = useDemo();
  
  const trackEvent = useCallback((event: string, properties: Record<string, any> = {}) => {
    analytics.track(event, {
      ...properties,
      demo_mode: isDemoMode,
      timestamp: new Date().toISOString()
    });
  }, [isDemoMode]);
  
  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);
  
  const trackConversion = useCallback((source: string, email?: string) => {
    trackEvent('waitlist_signup_completed', {
      source,
      email_domain: email ? email.split('@')[1] : undefined,
      conversion_completed: true
    });
  }, [trackEvent]);
  
  return { trackEvent, trackPageView, trackConversion };
};
```

### Database Migration Script

```bash
# Create migration file
# database/migrations/006_create_analytics_tables.sql

-- Run migration
npx wrangler d1 execute myjobtrack-db --file=database/migrations/006_create_analytics_tables.sql
```

### Analytics API Endpoints

```typescript
// src/api/analytics-handler.ts
export async function handleAnalyticsRequest(request: Request, env: any): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { event, properties, sessionId } = await request.json();
    
    const analyticsService = new AnalyticsService(env.DB);
    await analyticsService.track(event, properties);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: 'Failed to track event' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### Event Tracking Components
```typescript
// src/components/Analytics/TrackableButton.tsx
interface TrackableButtonProps {
  onClick: () => void;
  trackingEvent: string;
  trackingProperties?: Record<string, any>;
  children: ReactNode;
}

// Usage:
<TrackableButton
  trackingEvent="add_customer_clicked"
  trackingProperties={{ demo_mode: true, page: 'customers' }}
  onClick={handleAddCustomer}
>
  Add Customer
</TrackableButton>
```

### Analytics Dashboard Queries

```sql
-- Conversion rate by source
SELECT 
  conversion_source,
  COUNT(*) as total_sessions,
  SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
  (SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
FROM user_sessions 
WHERE demo_mode = 1 
GROUP BY conversion_source
ORDER BY conversion_rate DESC;

-- Most popular features (by event count)
SELECT 
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM engagement_events 
WHERE demo_mode = 1 
  AND event_category = 'feature_interaction'
GROUP BY event_name
ORDER BY event_count DESC;

-- User journey analysis
SELECT 
  pages_visited,
  COUNT(*) as session_count,
  AVG(duration) as avg_duration,
  SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions
FROM user_sessions 
WHERE demo_mode = 1 
GROUP BY pages_visited
ORDER BY conversions DESC;

-- Time to conversion analysis
SELECT 
  conversion_source,
  AVG(duration) as avg_time_to_conversion_seconds,
  MIN(duration) as fastest_conversion,
  MAX(duration) as slowest_conversion
FROM user_sessions 
WHERE converted = 1 AND demo_mode = 1
GROUP BY conversion_source;

-- Drop-off analysis by page
SELECT 
  exit_page,
  COUNT(*) as exit_count,
  AVG(page_views) as avg_pages_before_exit,
  (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_sessions WHERE demo_mode = 1)) as exit_percentage
FROM user_sessions 
WHERE demo_mode = 1 AND converted = 0
GROUP BY exit_page
ORDER BY exit_count DESC;

-- Feature usage before conversion
SELECT 
  features_used,
  COUNT(*) as usage_count,
  SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as led_to_conversion,
  (SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
FROM user_sessions 
WHERE demo_mode = 1 AND features_used IS NOT NULL
GROUP BY features_used
ORDER BY conversion_rate DESC;
```

### Implementation Checklist

- [ ] **Database Setup**:
  - [ ] Create migration file: `006_create_analytics_tables.sql`
  - [ ] Run migration on development database
  - [ ] Run migration on production database
  - [ ] Verify table creation and indexes

- [ ] **Service Implementation**:
  - [ ] Create `AnalyticsService` class
  - [ ] Implement `useAnalytics` hook
  - [ ] Add analytics API endpoints
  - [ ] Test event tracking functionality

- [ ] **Integration Points**:
  - [ ] Add analytics context to App.tsx
  - [ ] Implement page view tracking in router
  - [ ] Add event tracking to all CTA buttons
  - [ ] Track waitlist modal interactions
  - [ ] Track demo mode specific events

- [ ] **Dashboard & Queries**:
  - [ ] Create analytics dashboard page
  - [ ] Implement key metric queries
  - [ ] Add real-time event monitoring
  - [ ] Set up automated reports

### Privacy Compliance
- [ ] **GDPR/CCPA Compliance**:
  - [ ] Cookie consent banner
  - [ ] Data anonymization options
  - [ ] Opt-out mechanisms

- [ ] **Data Retention**:
  - [ ] Auto-deletion policies
  - [ ] User data export capabilities
  - [ ] Clear privacy policy

## 🚀 Quick Start Implementation

### Immediate Actions (1-2 hours)
1. [ ] Choose analytics service (recommend: Google Analytics 4)
2. [ ] Add tracking code to index.html
3. [ ] Create AnalyticsContext
4. [ ] Track basic page views

### Phase 1 Implementation (1 day)
1. [ ] Add click tracking to all CTA buttons
2. [ ] Track waitlist modal interactions
3. [ ] Set up demo mode specific events

### Phase 2 Enhancement (2-3 days)
1. [ ] Advanced event properties
2. [ ] User session tracking
3. [ ] Conversion funnel setup
4. [ ] Custom dashboard creation

## 📊 Expected Insights

After implementation, you'll be able to answer:
- **Which demo features drive the most waitlist signups?**
- **What's the optimal user journey for conversion?**
- **Where do users get stuck or confused?**
- **Which messaging resonates best?**
- **How can we improve the demo experience?**

## 🎯 Success Metrics
- [ ] **10%+ improvement** in demo → waitlist conversion
- [ ] **Clear identification** of top-performing features
- [ ] **Data-driven decisions** for product development
- [ ] **Optimized user flows** based on actual behavior
- [ ] **Better Slack notifications** with engagement context

## 📝 Notes
- Start simple with basic click tracking
- Focus on demo mode first (highest impact)
- Ensure privacy compliance from day one
- Use data to validate product-market fit
- Consider implementing custom analytics with Cloudflare Workers for full control

---

**Priority**: High (will significantly improve conversion rates)
**Effort**: Medium (2-3 days for full implementation)
**Impact**: High (data-driven optimization of the entire funnel)
