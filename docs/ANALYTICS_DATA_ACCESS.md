# Analytics Data Access Guide

## Overview

This document explains how to access analytics data from the My Job Track application from an external admin application or dashboard. The analytics system stores data in dedicated tables with the `trk_` prefix and provides multiple access methods.

## Data Architecture

### Database Tables

The analytics system uses the following tables:

```sql
-- Core event tracking
trk_events           -- All user events and interactions
trk_sessions         -- User session information  
trk_page_views       -- Page view tracking
trk_feature_usage    -- Feature interaction tracking
trk_funnels          -- Conversion funnel data
trk_ab_tests         -- A/B testing results
```

### Data Storage Locations

1. **Production**: Cloudflare D1 SQLite database
2. **Development**: Local SQLite database (`database/local.db`)
3. **Demo Mode**: Browser localStorage (for offline analytics)

## Access Methods

### 1. Direct API Access

#### Base URL
```
Production: https://your-cloudflare-worker.domain.workers.dev
Development: http://localhost:8787
```

#### Available Endpoints

##### Track Events (POST)
```
POST /api/analytics/track
Content-Type: application/json

{
  "event": "page_view",
  "properties": {
    "page": "/dashboard",
    "referrer": "https://google.com"
  },
  "userId": "user123",
  "sessionId": "session456",
  "timestamp": "2025-07-08T19:00:00.000Z",
  "demoMode": false,
  "userType": "authenticated"
}
```

##### Initialize Session (POST)
```
POST /api/analytics/session
Content-Type: application/json

{
  "sessionId": "session456",
  "userId": "user123",
  "demoMode": false,
  "userType": "authenticated",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "landingPage": "/"
}
```

##### Query Analytics Data (GET)
```
GET /api/analytics/query?query=conversion_rates&timeframe=7d
GET /api/analytics/query?query=popular_features&timeframe=30d
GET /api/analytics/query?query=user_journeys&timeframe=7d
GET /api/analytics/query?query=demo_engagement&timeframe=30d
```

### 2. Direct Database Access

#### Database Connection

For direct database access in a separate admin application:

```typescript
// Example using node-sqlite3 or better-sqlite3
import Database from 'better-sqlite3';

const db = new Database('path/to/database/local.db');

// Or for Cloudflare D1 in a Worker environment
const db = env.DB; // Cloudflare D1 binding
```

#### Common Queries

##### Get Event Summary
```sql
SELECT 
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(CASE WHEN demo_mode = 1 THEN 1 END) as demo_events,
  COUNT(CASE WHEN converted = 1 THEN 1 END) as conversions
FROM trk_events 
WHERE timestamp >= datetime('now', '-7 days')
GROUP BY event_name
ORDER BY event_count DESC;
```

##### Get User Journey Analysis
```sql
SELECT 
  s.session_id,
  s.user_type,
  s.demo_mode,
  s.landing_page,
  s.referrer,
  COUNT(e.id) as total_events,
  GROUP_CONCAT(e.event_name, ' -> ') as event_sequence,
  MIN(e.timestamp) as session_start,
  MAX(e.timestamp) as session_end
FROM trk_sessions s
LEFT JOIN trk_events e ON s.session_id = e.session_id
WHERE s.started_at >= datetime('now', '-7 days')
GROUP BY s.session_id
ORDER BY session_start DESC;
```

##### Get Feature Usage Stats
```sql
SELECT 
  feature_name,
  feature_category,
  action,
  COUNT(*) as usage_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(CASE WHEN demo_mode = 1 THEN 1 END) as demo_usage
FROM trk_feature_usage
WHERE timestamp >= datetime('now', '-30 days')
GROUP BY feature_name, feature_category, action
ORDER BY usage_count DESC;
```

##### Get Conversion Funnel
```sql
SELECT 
  'Landing Page Visit' as step,
  COUNT(DISTINCT session_id) as users,
  1 as step_order
FROM trk_page_views 
WHERE page_path = '/'
  AND timestamp >= datetime('now', '-7 days')

UNION ALL

SELECT 
  'Demo Mode Entry' as step,
  COUNT(DISTINCT session_id) as users,
  2 as step_order
FROM trk_events 
WHERE event_name = 'demo_entry'
  AND timestamp >= datetime('now', '-7 days')

UNION ALL

SELECT 
  'Feature Interaction' as step,
  COUNT(DISTINCT session_id) as users,
  3 as step_order
FROM trk_feature_usage
WHERE timestamp >= datetime('now', '-7 days')

UNION ALL

SELECT 
  'Waitlist Signup' as step,
  COUNT(DISTINCT session_id) as users,
  4 as step_order
FROM trk_events 
WHERE event_name = 'waitlist_signup_completed'
  AND timestamp >= datetime('now', '-7 days')

ORDER BY step_order;
```

### 3. Admin Dashboard Integration

#### React Admin Dashboard Example

```typescript
// AdminAnalyticsPage.tsx
import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  conversionRates: ConversionRate[];
  popularFeatures: FeatureUsage[];
  userJourneys: UserJourney[];
  demoEngagement: DemoEngagement[];
}

const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      const [conversions, features, journeys, demo] = await Promise.all([
        fetch(`/api/analytics/query?query=conversion_rates&timeframe=${timeframe}`),
        fetch(`/api/analytics/query?query=popular_features&timeframe=${timeframe}`),
        fetch(`/api/analytics/query?query=user_journeys&timeframe=${timeframe}`),
        fetch(`/api/analytics/query?query=demo_engagement&timeframe=${timeframe}`)
      ]);

      setAnalytics({
        conversionRates: await conversions.json(),
        popularFeatures: await features.json(),
        userJourneys: await journeys.json(),
        demoEngagement: await demo.json()
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  return (
    <div className="admin-analytics">
      <h1>Analytics Dashboard</h1>
      
      <div className="timeframe-selector">
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {analytics && (
        <>
          <ConversionRatesChart data={analytics.conversionRates} />
          <PopularFeaturesTable data={analytics.popularFeatures} />
          <UserJourneysAnalysis data={analytics.userJourneys} />
          <DemoEngagementMetrics data={analytics.demoEngagement} />
        </>
      )}
    </div>
  );
};
```

#### Node.js Backend Integration

```typescript
// analytics-service.js
import Database from 'better-sqlite3';

class AnalyticsService {
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  async getEventSummary(timeframe: string = '7d') {
    const sql = `
      SELECT 
        event_name,
        COUNT(*) as count,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT user_id) as unique_users
      FROM trk_events 
      WHERE timestamp >= datetime('now', '-${timeframe}')
      GROUP BY event_name
      ORDER BY count DESC
    `;
    
    return this.db.prepare(sql).all();
  }

  async getUserActivity(userId: string) {
    const sql = `
      SELECT 
        e.event_name,
        e.properties,
        e.timestamp,
        s.user_type,
        s.demo_mode
      FROM trk_events e
      JOIN trk_sessions s ON e.session_id = s.session_id
      WHERE e.user_id = ?
      ORDER BY e.timestamp DESC
      LIMIT 100
    `;
    
    return this.db.prepare(sql).all(userId);
  }

  async getConversionFunnel(timeframe: string = '7d') {
    // Implementation of conversion funnel query
    // Returns step-by-step conversion data
  }

  async exportAnalyticsData(startDate: string, endDate: string) {
    const events = this.db.prepare(`
      SELECT * FROM trk_events 
      WHERE timestamp BETWEEN ? AND ?
      ORDER BY timestamp
    `).all(startDate, endDate);

    const sessions = this.db.prepare(`
      SELECT * FROM trk_sessions 
      WHERE started_at BETWEEN ? AND ?
      ORDER BY started_at
    `).all(startDate, endDate);

    return { events, sessions };
  }
}

export default AnalyticsService;
```

### 4. Data Export Options

#### CSV Export
```typescript
// Export events as CSV
const exportEventsCSV = async (startDate: string, endDate: string) => {
  const events = await db.prepare(`
    SELECT 
      e.timestamp,
      e.event_name,
      e.user_id,
      e.session_id,
      s.user_type,
      e.demo_mode,
      e.properties,
      e.page_path
    FROM trk_events e
    LEFT JOIN trk_sessions s ON e.session_id = s.session_id
    WHERE e.timestamp BETWEEN ? AND ?
    ORDER BY e.timestamp
  `).all(startDate, endDate);

  const csv = convertToCSV(events);
  return csv;
};
```

#### JSON Export
```typescript
// Export complete analytics dataset
const exportAnalyticsJSON = async (timeframe: string) => {
  const data = {
    events: await getEvents(timeframe),
    sessions: await getSessions(timeframe),
    pageViews: await getPageViews(timeframe),
    featureUsage: await getFeatureUsage(timeframe),
    metadata: {
      exportDate: new Date().toISOString(),
      timeframe,
      totalEvents: await getEventCount(timeframe)
    }
  };

  return JSON.stringify(data, null, 2);
};
```

## Authentication & Security

### Admin API Access

For production environments, implement proper authentication:

```typescript
// Add authentication middleware
const authenticateAdmin = async (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }

  // Verify JWT token or API key
  const isValid = await verifyAdminToken(token);
  if (!isValid) {
    throw new Error('Invalid authentication token');
  }
};

// Protected analytics endpoint
export async function handleAnalyticsQuery(request: Request, env: Env) {
  try {
    await authenticateAdmin(request);
    // ... rest of analytics query logic
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

### Rate Limiting

Implement rate limiting for analytics endpoints:

```typescript
// Rate limiting for analytics queries
const rateLimiter = new Map();

const checkRateLimit = (clientIP: string) => {
  const now = Date.now();
  const window = 60000; // 1 minute
  const maxRequests = 100;

  if (!rateLimiter.has(clientIP)) {
    rateLimiter.set(clientIP, { count: 1, timestamp: now });
    return true;
  }

  const client = rateLimiter.get(clientIP);
  if (now - client.timestamp > window) {
    client.count = 1;
    client.timestamp = now;
    return true;
  }

  client.count++;
  return client.count <= maxRequests;
};
```

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Event Volume**: Track daily/hourly event counts
2. **Conversion Rates**: Monitor signup and engagement conversions
3. **Feature Adoption**: Track new feature usage
4. **Demo Mode Usage**: Monitor demo user engagement
5. **Error Rates**: Track analytics collection failures

### Sample Monitoring Queries

```sql
-- Daily event volume
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as events,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(DISTINCT user_id) as users
FROM trk_events
WHERE timestamp >= datetime('now', '-30 days')
GROUP BY DATE(timestamp)
ORDER BY date;

-- Conversion rate trends
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_events,
  COUNT(CASE WHEN converted = 1 THEN 1 END) as conversions,
  ROUND(COUNT(CASE WHEN converted = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as conversion_rate
FROM trk_events
WHERE timestamp >= datetime('now', '-30 days')
GROUP BY DATE(timestamp)
ORDER BY date;
```

## Integration Examples

### Grafana Dashboard

```yaml
# grafana-datasource.yml
datasources:
  - name: MyJobTrack Analytics
    type: sqlite
    url: file:///path/to/database/local.db
    access: direct
```

### Google Analytics Integration

```typescript
// Send key events to Google Analytics
const sendToGA = (event: AnalyticsEvent) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', event.event, {
      event_category: event.properties.category,
      event_label: event.properties.label,
      value: event.properties.value,
      custom_map: {
        user_type: event.userType,
        demo_mode: event.demoMode
      }
    });
  }
};
```

### Slack Notifications

```typescript
// Send analytics alerts to Slack
const sendSlackAlert = async (metric: string, value: number, threshold: number) => {
  if (value > threshold) {
    const message = `🚨 Analytics Alert: ${metric} has reached ${value} (threshold: ${threshold})`;
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
  }
};
```

## Best Practices

1. **Data Privacy**: Ensure compliance with GDPR/CCPA when accessing user data
2. **Performance**: Use appropriate indexes and query optimization
3. **Caching**: Cache frequently accessed analytics data
4. **Backup**: Regularly backup analytics data
5. **Documentation**: Keep analytics queries and KPIs documented
6. **Testing**: Test analytics queries with realistic data volumes

## Troubleshooting

### Common Issues

1. **Missing Data**: Check that AnalyticsContext is properly wrapped around the app
2. **Performance**: Use LIMIT clauses and date ranges in queries
3. **Storage Limits**: Monitor database size and implement data retention policies
4. **CORS Issues**: Ensure proper CORS headers for cross-origin requests

### Debug Queries

```sql
-- Check recent events
SELECT * FROM trk_events ORDER BY timestamp DESC LIMIT 10;

-- Check session counts
SELECT COUNT(*) as total_sessions, COUNT(DISTINCT user_id) as unique_users FROM trk_sessions;

-- Check for missing data
SELECT DATE(timestamp) as date, COUNT(*) as events 
FROM trk_events 
WHERE timestamp >= datetime('now', '-7 days')
GROUP BY DATE(timestamp);
```

This comprehensive guide provides multiple ways to access and analyze the analytics data from your My Job Track application in separate admin tools or dashboards.
