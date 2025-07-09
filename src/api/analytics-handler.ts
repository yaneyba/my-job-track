import { Env } from './types';
import { corsHeaders } from './utils/cors';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  demoMode: boolean;
  userType: 'demo' | 'waitlisted' | 'authenticated' | 'anonymous';
}

interface SessionInitData {
  sessionId: string;
  userId?: string;
  demoMode: boolean;
  userType: string;
  referrer?: string;
  userAgent?: string;
  landingPage?: string;
}

export async function handleAnalyticsTrack(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const eventData: AnalyticsEvent = await request.json();
    
    // Insert event into trk_events table
    await env.DB.prepare(`
      INSERT INTO trk_events (
        id, session_id, user_id, event_name, event_category, page_path,
        properties, demo_mode, user_type, user_agent, ip_address, referrer,
        session_duration, conversion_source, converted, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      eventData.sessionId,
      eventData.userId || null,
      eventData.event,
      categorizeEvent(eventData.event),
      eventData.properties.page || null,
      JSON.stringify(eventData.properties),
      eventData.demoMode,
      eventData.userType,
      request.headers.get('User-Agent') || null,
      request.headers.get('CF-Connecting-IP') || null,
      eventData.properties.referrer || null,
      eventData.properties.sessionDuration || 0,
      eventData.properties.source || null,
      eventData.event === 'waitlist_signup_completed',
      eventData.timestamp
    ).run();

    // If it's a page view, also insert into trk_page_views
    if (eventData.event === 'page_view') {
      await env.DB.prepare(`
        INSERT INTO trk_page_views (
          id, session_id, user_id, page_path, page_title,
          demo_mode, referrer, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        eventData.sessionId,
        eventData.userId || null,
        eventData.properties.page,
        eventData.properties.pageTitle || null,
        eventData.demoMode,
        eventData.properties.referrer || null,
        eventData.timestamp
      ).run();
    }

    // If it's a feature interaction, also insert into trk_feature_usage
    if (eventData.event === 'feature_interaction') {
      await env.DB.prepare(`
        INSERT INTO trk_feature_usage (
          id, session_id, user_id, feature_name, feature_category,
          action, demo_mode, properties, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(),
        eventData.sessionId,
        eventData.userId || null,
        eventData.properties.feature,
        eventData.properties.feature_category,
        eventData.properties.action,
        eventData.demoMode,
        JSON.stringify(eventData.properties),
        eventData.timestamp
      ).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to track event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

export async function handleSessionInit(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const sessionData: SessionInitData = await request.json();
    
    // Insert or update session in trk_sessions table
    await env.DB.prepare(`
      INSERT OR REPLACE INTO trk_sessions (
        session_id, user_id, demo_mode, user_type, user_agent,
        ip_address, referrer, country, landing_page, started_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      sessionData.sessionId,
      sessionData.userId || null,
      sessionData.demoMode,
      sessionData.userType,
      sessionData.userAgent || null,
      request.headers.get('CF-Connecting-IP') || null,
      sessionData.referrer || null,
      request.headers.get('CF-IPCountry') || null,
      sessionData.landingPage || null
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Session initialization error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to initialize session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

export async function handleAnalyticsQuery(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const timeframe = url.searchParams.get('timeframe') || '7d';
    
    let results;
    
    switch (query) {
      case 'conversion_rates':
        results = await getConversionRates(env.DB, timeframe);
        break;
      case 'popular_features':
        results = await getPopularFeatures(env.DB, timeframe);
        break;
      case 'user_journeys':
        results = await getUserJourneys(env.DB, timeframe);
        break;
      case 'demo_engagement':
        results = await getDemoEngagement(env.DB, timeframe);
        break;
      default:
        return new Response('Invalid query', { 
          status: 400,
          headers: corsHeaders
        });
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Analytics query error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to execute query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Helper functions for analytics queries
async function getConversionRates(db: any, timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const result = await db.prepare(`
    SELECT 
      conversion_source,
      COUNT(*) as total_sessions,
      SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
      (SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
    FROM trk_sessions 
    WHERE demo_mode = 1 AND started_at >= datetime('now', ?)
    GROUP BY conversion_source
    ORDER BY conversion_rate DESC
  `).bind(timeFilter).all();
  
  return result.results;
}

async function getPopularFeatures(db: any, timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const result = await db.prepare(`
    SELECT 
      feature_name,
      feature_category,
      COUNT(*) as usage_count,
      COUNT(DISTINCT session_id) as unique_sessions
    FROM trk_feature_usage 
    WHERE timestamp >= datetime('now', ?) AND demo_mode = 1
    GROUP BY feature_name, feature_category
    ORDER BY usage_count DESC
    LIMIT 20
  `).bind(timeFilter).all();
  
  return result.results;
}

async function getUserJourneys(db: any, timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const result = await db.prepare(`
    SELECT 
      pages_visited,
      COUNT(*) as session_count,
      AVG(duration) as avg_duration,
      SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions
    FROM trk_sessions 
    WHERE demo_mode = 1 AND started_at >= datetime('now', ?)
    GROUP BY pages_visited
    ORDER BY conversions DESC
    LIMIT 20
  `).bind(timeFilter).all();
  
  return result.results;
}

async function getDemoEngagement(db: any, timeframe: string) {
  const timeFilter = getTimeFilter(timeframe);
  
  const result = await db.prepare(`
    SELECT 
      DATE(started_at) as date,
      COUNT(*) as sessions,
      AVG(duration) as avg_duration,
      AVG(page_views) as avg_page_views,
      SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
      (SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
    FROM trk_sessions 
    WHERE demo_mode = 1 AND started_at >= datetime('now', ?)
    GROUP BY DATE(started_at)
    ORDER BY date DESC
  `).bind(timeFilter).all();
  
  return result.results;
}

function getTimeFilter(timeframe: string): string {
  switch (timeframe) {
    case '1d': return '-1 day';
    case '7d': return '-7 days';
    case '30d': return '-30 days';
    case '90d': return '-90 days';
    default: return '-7 days';
  }
}

function categorizeEvent(event: string): string {
  if (event.includes('page_view') || event.includes('navigation')) return 'navigation';
  if (event.includes('waitlist') || event.includes('signup') || event.includes('conversion')) return 'conversion';
  if (event.includes('demo')) return 'demo_mode';
  if (event.includes('feature')) return 'feature_interaction';
  return 'other';
}
