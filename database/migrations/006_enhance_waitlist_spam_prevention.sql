-- Enhance waitlist table for spam prevention
-- Add indices for better performance on spam checks

-- Index for IP-based rate limiting queries
CREATE INDEX IF NOT EXISTS idx_waitlist_ip_created ON waitlist(ipAddress, createdAt);

-- Index for email pattern matching
CREATE INDEX IF NOT EXISTS idx_waitlist_email_created ON waitlist(email, createdAt);

-- Create table to track blocked attempts (optional - for monitoring)
CREATE TABLE IF NOT EXISTS waitlist_blocked_attempts (
    id TEXT PRIMARY KEY,
    ipAddress TEXT NOT NULL,
    email TEXT,
    userAgent TEXT,
    blockReason TEXT NOT NULL,
    attemptedAt TEXT NOT NULL DEFAULT (datetime('now')),
    
    -- Indices for monitoring queries
    INDEX idx_blocked_ip (ipAddress),
    INDEX idx_blocked_reason (blockReason),
    INDEX idx_blocked_timestamp (attemptedAt)
);

-- Create a view for spam monitoring (optional)
CREATE VIEW IF NOT EXISTS waitlist_spam_stats AS
SELECT 
    blockReason,
    COUNT(*) as attempt_count,
    COUNT(DISTINCT ipAddress) as unique_ips,
    DATE(attemptedAt) as attempt_date
FROM waitlist_blocked_attempts 
GROUP BY blockReason, DATE(attemptedAt)
ORDER BY attempt_date DESC, attempt_count DESC;
