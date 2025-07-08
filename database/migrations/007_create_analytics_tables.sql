-- Create user engagement tracking tables with trk_ prefix
-- Migration: 007_create_analytics_tables.sql

-- User engagement events table
CREATE TABLE IF NOT EXISTS trk_events (
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
    user_type TEXT,  -- 'demo', 'waitlisted', 'authenticated', 'anonymous'
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    
    -- Session data
    session_duration INTEGER,  -- Seconds since session start
    page_views_in_session INTEGER,
    
    -- Conversion tracking
    conversion_source TEXT,  -- 'add_customer', 'qr_scan', etc.
    converted BOOLEAN DEFAULT FALSE
);

-- User sessions table
CREATE TABLE IF NOT EXISTS trk_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT,  -- Optional, for authenticated users
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    duration INTEGER,  -- Total session duration in seconds
    
    -- Session metadata
    demo_mode BOOLEAN DEFAULT FALSE,
    user_type TEXT,  -- 'demo', 'waitlisted', 'authenticated', 'anonymous'
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    country TEXT,  -- From Cloudflare geolocation (if available)
    
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
    pages_visited TEXT  -- JSON array of pages visited
);

-- Conversion funnel analysis table
CREATE TABLE IF NOT EXISTS trk_funnels (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    funnel_step TEXT NOT NULL,  -- 'landing', 'demo_entry', 'feature_use', 'waitlist_cta', 'signup'
    step_order INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Step-specific data
    step_properties TEXT,  -- JSON with step-specific information
    time_from_previous_step INTEGER,  -- Seconds from previous step
    
    FOREIGN KEY (session_id) REFERENCES trk_sessions(session_id)
);

-- A/B testing variants table (for future use)
CREATE TABLE IF NOT EXISTS trk_ab_tests (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (session_id) REFERENCES trk_sessions(session_id)
);

-- Feature usage tracking table
CREATE TABLE IF NOT EXISTS trk_feature_usage (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,
    feature_name TEXT NOT NULL,
    feature_category TEXT,
    action TEXT NOT NULL,  -- 'click', 'view', 'submit', 'cancel', etc.
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Feature context
    demo_mode BOOLEAN DEFAULT FALSE,
    properties TEXT,  -- JSON with feature-specific data
    
    FOREIGN KEY (session_id) REFERENCES trk_sessions(session_id)
);

-- Page views tracking table
CREATE TABLE IF NOT EXISTS trk_page_views (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,
    page_path TEXT NOT NULL,
    page_title TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Page context
    demo_mode BOOLEAN DEFAULT FALSE,
    referrer TEXT,
    time_on_page INTEGER,  -- Seconds spent on page
    
    FOREIGN KEY (session_id) REFERENCES trk_sessions(session_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trk_events_session_id ON trk_events(session_id);
CREATE INDEX IF NOT EXISTS idx_trk_events_event_name ON trk_events(event_name);
CREATE INDEX IF NOT EXISTS idx_trk_events_timestamp ON trk_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_trk_events_demo_mode ON trk_events(demo_mode);
CREATE INDEX IF NOT EXISTS idx_trk_events_converted ON trk_events(converted);
CREATE INDEX IF NOT EXISTS idx_trk_events_user_type ON trk_events(user_type);

CREATE INDEX IF NOT EXISTS idx_trk_sessions_started_at ON trk_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_trk_sessions_demo_mode ON trk_sessions(demo_mode);
CREATE INDEX IF NOT EXISTS idx_trk_sessions_converted ON trk_sessions(converted);
CREATE INDEX IF NOT EXISTS idx_trk_sessions_user_type ON trk_sessions(user_type);

CREATE INDEX IF NOT EXISTS idx_trk_funnels_session_funnel ON trk_funnels(session_id, step_order);
CREATE INDEX IF NOT EXISTS idx_trk_funnels_step ON trk_funnels(funnel_step);

CREATE INDEX IF NOT EXISTS idx_trk_ab_tests_test_variant ON trk_ab_tests(test_name, variant_name);

CREATE INDEX IF NOT EXISTS idx_trk_feature_usage_feature ON trk_feature_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_trk_feature_usage_category ON trk_feature_usage(feature_category);
CREATE INDEX IF NOT EXISTS idx_trk_feature_usage_timestamp ON trk_feature_usage(timestamp);

CREATE INDEX IF NOT EXISTS idx_trk_page_views_page_path ON trk_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_trk_page_views_timestamp ON trk_page_views(timestamp);

-- Create triggers to automatically update session metrics
CREATE TRIGGER IF NOT EXISTS update_session_events_count 
    AFTER INSERT ON trk_events
    BEGIN
        UPDATE trk_sessions 
        SET events_count = events_count + 1,
            ended_at = CURRENT_TIMESTAMP,
            duration = (strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', started_at))
        WHERE session_id = NEW.session_id;
    END;

CREATE TRIGGER IF NOT EXISTS update_session_page_views 
    AFTER INSERT ON trk_page_views
    BEGIN
        UPDATE trk_sessions 
        SET page_views = page_views + 1,
            ended_at = CURRENT_TIMESTAMP,
            duration = (strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', started_at))
        WHERE session_id = NEW.session_id;
    END;

-- Create trigger to mark session as converted when conversion event occurs
CREATE TRIGGER IF NOT EXISTS mark_session_converted 
    AFTER INSERT ON trk_events
    WHEN NEW.event_name = 'waitlist_signup_completed'
    BEGIN
        UPDATE trk_sessions 
        SET converted = TRUE,
            conversion_event = NEW.event_name,
            conversion_source = json_extract(NEW.properties, '$.source'),
            waitlist_email = json_extract(NEW.properties, '$.email')
        WHERE session_id = NEW.session_id;
    END;
