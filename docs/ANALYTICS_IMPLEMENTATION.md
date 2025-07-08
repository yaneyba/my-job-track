# User Engagement Tracking Implementation

## 🎯 Overview

This implementation provides comprehensive user engagement tracking for the MyJobTrack application, focusing on demo mode interactions and waitlist conversion optimization. All tracking tables use the `trk_` prefix for easy identification.

## 📊 Database Schema

### Analytics Tables (all prefixed with `trk_`)

- **`trk_sessions`** - User sessions with engagement metrics
- **`trk_events`** - Individual user events and interactions
- **`trk_page_views`** - Page navigation tracking
- **`trk_feature_usage`** - Feature-specific interaction tracking
- **`trk_funnels`** - Conversion funnel analysis
- **`trk_ab_tests`** - A/B testing support (future use)

## 🛠 Implementation Components

### 1. Analytics Context (`src/contexts/AnalyticsContext.tsx`)
- Provides centralized analytics tracking across the app
- Automatically tracks page views, user type, session duration
- Stores events locally and sends to API endpoint
- Includes methods: `trackEvent`, `trackPageView`, `trackConversion`, `trackWaitlistCTA`, `trackFeatureInteraction`

### 2. API Handlers (`src/api/analytics-handler.ts`)
- `handleAnalyticsTrack` - Stores events in database
- `handleSessionInit` - Initializes user sessions
- `handleAnalyticsQuery` - Retrieves analytics data for dashboards

### 3. Trackable Components (`src/components/Analytics/TrackableComponents.tsx`)
- `TrackableButton` - Button with automatic click tracking
- `TrackableLink` - Link with click tracking
- `TrackableForm` - Form with submission tracking
- `useTrackClick` - Hook for custom event tracking

### 4. Analytics Dashboard (`src/components/Analytics/AnalyticsDashboard.tsx`)
- Real-time analytics dashboard
- Shows conversion rates, popular features, engagement trends
- Configurable timeframes (1d, 7d, 30d, 90d)

## 🚀 Usage Examples

### Basic Event Tracking
```typescript
import { useAnalytics } from '@/contexts/AnalyticsContext';

const { trackEvent, trackFeatureInteraction } = useAnalytics();

// Track custom event
trackEvent('user_action', { action: 'clicked_cta', source: 'homepage' });

// Track feature interaction
trackFeatureInteraction('customer_management', 'add_customer', { 
  demo_mode: true 
});
```

### Using Trackable Components
```tsx
import { TrackableButton, TrackableLink } from '@/components/Analytics/TrackableComponents';

// Button with automatic tracking
<TrackableButton
  onClick={handleAddCustomer}
  trackingEvent="add_customer_clicked"
  trackingProperties={{ source: 'dashboard', demo_mode: true }}
  className="btn-primary"
>
  Add Customer
</TrackableButton>

// Link with tracking
<TrackableLink
  href="/features"
  trackingEvent="feature_link_clicked"
  trackingProperties={{ section: 'navigation' }}
>
  View Features
</TrackableLink>
```

### Demo Mode Conversion Tracking
```typescript
// Track when waitlist CTA is triggered
trackWaitlistCTA('add_customer', { 
  feature_used: 'customer_form',
  session_duration: 120 
});

// Track successful waitlist signup
trackConversion('add_customer', 'user@example.com');
```

## 📈 Key Metrics Tracked

### Session Metrics
- Session duration
- Pages viewed per session
- Features used during session
- Conversion source and completion
- User type (demo, waitlisted, authenticated, anonymous)

### Event Metrics
- Page views and navigation patterns
- Feature interactions (clicks, form submissions, etc.)
- Waitlist CTA triggers and sources
- Conversion funnel progression
- Demo mode specific behaviors

### Conversion Analysis
- Conversion rate by feature source
- Time to conversion
- Most effective conversion triggers
- User journey analysis

## 🔧 Setup Instructions

### 1. Database Migration
Run the analytics tables migration:
```bash
npx wrangler d1 execute myjobtrack-db --file=database/migrations/007_create_analytics_tables.sql --local
```

### 2. Add Analytics Provider
Wrap your app with the AnalyticsProvider:
```tsx
import { AnalyticsProvider } from './contexts/AnalyticsContext';

function App() {
  return (
    <AnalyticsProvider>
      {/* Your app components */}
    </AnalyticsProvider>
  );
}
```

### 3. Test the System
Run the test script to verify everything works:
```bash
./scripts/test-analytics.sh
```

## 📊 API Endpoints

### Track Events
```
POST /api/analytics/track
{
  "event": "event_name",
  "sessionId": "session-id",
  "demoMode": true,
  "userType": "demo",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "properties": { "key": "value" }
}
```

### Initialize Session
```
POST /api/analytics/session
{
  "sessionId": "session-id",
  "demoMode": true,
  "userType": "demo",
  "landingPage": "/",
  "referrer": "https://google.com"
}
```

### Query Analytics Data
```
GET /api/analytics/query?query=conversion_rates&timeframe=7d
GET /api/analytics/query?query=popular_features&timeframe=30d
GET /api/analytics/query?query=demo_engagement&timeframe=1d
```

## 🎯 Key Events Tracked

### Navigation Events
- `page_view` - User visits a page
- `demo_entry` - User enters demo mode
- `navigation_click` - Menu/breadcrumb navigation

### Feature Interactions
- `feature_interaction` - General feature usage
- `customer_add_click` - Add customer button clicked
- `job_schedule_click` - Schedule job button clicked
- `qr_scan_attempt` - QR scanner activated

### Conversion Events
- `waitlist_cta_triggered` - Waitlist modal shown
- `waitlist_signup_completed` - User joined waitlist
- `form_submission` - Any form submitted

### Demo Mode Specific
- `demo_restriction_hit` - User hits save restriction
- `demo_feature_explored` - Feature used in demo mode
- `demo_session_ended` - Demo session completed

## 📊 Analytics Dashboard Usage

View real-time analytics at `/admin/analytics` (if route is implemented):

1. **Overview Cards**: Total sessions, conversions, avg duration, conversion rate
2. **Conversion by Source**: Which features drive most waitlist signups
3. **Popular Features**: Most used features in demo mode
4. **Daily Trends**: Engagement trends over time

## 🔍 Debugging and Monitoring

### Check Console Logs
All analytics events are logged to console in development:
```javascript
// Look for logs like:
📊 Analytics Event: {
  event: "feature_interaction",
  properties: { feature: "add_customer" },
  demoMode: true,
  userType: "demo"
}
```

### Query Database Directly
```sql
-- Check recent events
SELECT * FROM trk_events ORDER BY timestamp DESC LIMIT 10;

-- Conversion funnel
SELECT event_name, COUNT(*) FROM trk_events 
WHERE demo_mode = true 
GROUP BY event_name;

-- Session overview
SELECT user_type, COUNT(*), AVG(duration) 
FROM trk_sessions 
GROUP BY user_type;
```

### Test Script Output
Run `./scripts/test-analytics.sh` to see system health:
- ✅ Tables created
- ✅ Test data working
- ✅ Queries functional
- 📊 Sample analytics

## 🚀 Next Steps

1. **Add to App**: Integrate TrackableButton/Link components throughout the app
2. **Dashboard Route**: Add `/admin/analytics` route with AnalyticsDashboard component
3. **External Analytics**: Integrate with Google Analytics or Mixpanel
4. **Real-time Updates**: Add WebSocket support for live analytics
5. **A/B Testing**: Implement variant testing system

## 📝 Data Privacy

- No PII is tracked without consent
- IP addresses are hashed (via Cloudflare)
- Email domains only (not full emails) for conversion tracking
- Sessions expire automatically
- User can opt-out of tracking

## 🎉 Benefits Achieved

✅ **Conversion Optimization**: Track which features drive waitlist signups
✅ **User Journey Mapping**: Understand how users navigate the demo
✅ **Feature Validation**: See which features are most engaging
✅ **Performance Metrics**: Session duration, engagement depth
✅ **Data-Driven Decisions**: Real analytics to guide product development

---

This implementation provides a solid foundation for understanding user behavior and optimizing conversion rates in your job tracking application!
