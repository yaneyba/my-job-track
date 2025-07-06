-- MyJobTrack D1 Database Schema

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    businessName TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    priority TEXT NOT NULL DEFAULT 'medium',
    scheduledDate TEXT,
    completedDate TEXT,
    estimatedHours REAL,
    actualHours REAL,
    hourlyRate REAL,
    totalAmount REAL,
    paymentStatus TEXT NOT NULL DEFAULT 'unpaid',
    location TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    businessName TEXT,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON jobs(customerId);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date ON jobs(scheduledDate);
CREATE INDEX IF NOT EXISTS idx_jobs_payment_status ON jobs(paymentStatus);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Triggers to update updatedAt timestamp
CREATE TRIGGER IF NOT EXISTS update_customers_timestamp 
    AFTER UPDATE ON customers
    BEGIN
        UPDATE customers SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_jobs_timestamp 
    AFTER UPDATE ON jobs
    BEGIN
        UPDATE jobs SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
