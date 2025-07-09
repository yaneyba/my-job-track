-- ===============================================
-- My Job Track - Core Business Schema
-- Simplified version with only essential tables
-- ===============================================

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
-- CORE INDEXES
-- ===============================================

-- Performance indexes for core tables
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_due_date ON jobs(due_date);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_waitlist_email ON waitlist(email);
