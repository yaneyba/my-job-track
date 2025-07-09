-- ===============================================
-- My Job Track Database Schema
-- Database: myjobtrack-db
-- Database ID: d729dbcd-e5de-4073-9bcb-7d9f1544729d
-- Generated: 2025-07-08
-- ===============================================

-- Drop tables if they exist (for fresh installation)
-- Note: Order matters due to foreign key constraints
DROP TABLE IF EXISTS trk_ab_tests;
DROP TABLE IF EXISTS trk_events;
DROP TABLE IF EXISTS trk_feature_usage;
DROP TABLE IF EXISTS trk_funnels;
DROP TABLE IF EXISTS trk_page_views;
DROP TABLE IF EXISTS trk_sessions;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS waitlist;
DROP TABLE IF EXISTS d1_migrations;
DROP TABLE IF EXISTS _cf_KV;

-- ===============================================
-- CORE BUSINESS TABLES
-- ===============================================

-- Users table - Main authentication and user management
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Customers table - Client management
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    business_name TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs table - Job/project management
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    estimated_cost REAL,
    actual_cost REAL,
    estimated_hours REAL,
    actual_hours REAL,
    due_date TEXT,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Sessions table - User session management
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Waitlist table - Pre-launch waitlist management
CREATE TABLE waitlist (
    id TEXT PRIMARY KEY, 
    email TEXT NOT NULL UNIQUE, 
    businessType TEXT, 
    source TEXT, 
    ipAddress TEXT, 
    userAgent TEXT, 
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===============================================
-- ANALYTICS & TRACKING TABLES
-- ===============================================

-- Analytics sessions tracking
CREATE TABLE trk_sessions (
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

-- Page views tracking
CREATE TABLE trk_page_views (
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

-- General events tracking
CREATE TABLE trk_events (
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

-- Feature usage tracking
CREATE TABLE trk_feature_usage (
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

-- Funnel analysis tracking
CREATE TABLE trk_funnels (
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

-- A/B testing tracking
CREATE TABLE trk_ab_tests (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES trk_sessions(session_id)
);

-- ===============================================
-- SYSTEM TABLES
-- ===============================================

-- D1 migrations tracking (Cloudflare managed)
CREATE TABLE d1_migrations(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Cloudflare KV storage table
CREATE TABLE _cf_KV (
    key TEXT PRIMARY KEY,
    value BLOB
) WITHOUT ROWID;

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Core business table indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_due_date ON jobs(due_date);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Analytics table indexes
CREATE INDEX idx_trk_sessions_started_at ON trk_sessions(started_at);
CREATE INDEX idx_trk_sessions_user_type ON trk_sessions(user_type);
CREATE INDEX idx_trk_sessions_demo_mode ON trk_sessions(demo_mode);
CREATE INDEX idx_trk_sessions_converted ON trk_sessions(converted);

CREATE INDEX idx_trk_page_views_page_path ON trk_page_views(page_path);
CREATE INDEX idx_trk_page_views_timestamp ON trk_page_views(timestamp);

CREATE INDEX idx_trk_events_session_id ON trk_events(session_id);
CREATE INDEX idx_trk_events_event_name ON trk_events(event_name);
CREATE INDEX idx_trk_events_timestamp ON trk_events(timestamp);
CREATE INDEX idx_trk_events_user_type ON trk_events(user_type);
CREATE INDEX idx_trk_events_demo_mode ON trk_events(demo_mode);
CREATE INDEX idx_trk_events_converted ON trk_events(converted);

CREATE INDEX idx_trk_feature_usage_feature ON trk_feature_usage(feature_name);
CREATE INDEX idx_trk_feature_usage_category ON trk_feature_usage(feature_category);
CREATE INDEX idx_trk_feature_usage_timestamp ON trk_feature_usage(timestamp);

CREATE INDEX idx_trk_funnels_step ON trk_funnels(funnel_step);
CREATE INDEX idx_trk_funnels_session_funnel ON trk_funnels(session_id, step_order);

CREATE INDEX idx_trk_ab_tests_test_variant ON trk_ab_tests(test_name, variant_name);

-- ===============================================
-- NOTES
-- ===============================================
-- 
-- Database Statistics (as of 2025-07-08):
-- - Total Tables: 13
-- - Total Indexes: 26 
-- - Database Size: ~245KB
-- - Main Tables: users, customers, jobs, sessions, waitlist
-- - Analytics Tables: trk_* (comprehensive tracking system)
-- - System Tables: d1_migrations, _cf_KV
--
-- Key Features:
-- 1. Complete job management system (users, customers, jobs)
-- 2. Session management with token-based authentication
-- 3. Comprehensive analytics and tracking system
-- 4. A/B testing capabilities
-- 5. Waitlist management for pre-launch
-- 6. Performance optimized with proper indexing
-- 7. Foreign key constraints for data integrity
--
-- Usage:
-- - This schema supports a complete job tracking application
-- - Analytics system tracks user behavior, conversions, and feature usage
-- - Designed for Cloudflare D1 (SQLite-compatible)
-- - Compatible with the My Job Track application ecosystem
--
