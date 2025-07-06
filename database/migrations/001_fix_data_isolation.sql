-- URGENT: Fix data isolation by adding user_id to existing tables
-- Run this on your Cloudflare D1 database immediately

-- Add user_id column to jobs table if it doesn't exist
ALTER TABLE jobs ADD COLUMN user_id TEXT;

-- Add user_id column to customers table if it doesn't exist  
ALTER TABLE customers ADD COLUMN user_id TEXT;

-- Update existing jobs to assign them to the first user (if any)
-- WARNING: This assumes you have users in the database
UPDATE jobs SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Update existing customers to assign them to the first user (if any)
UPDATE customers SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Make user_id required (after updating existing records)
-- Note: SQLite doesn't support ALTER COLUMN, so we'll add constraints through app logic

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- Verify the fix
SELECT 'Jobs with user_id' as table_name, COUNT(*) as count FROM jobs WHERE user_id IS NOT NULL
UNION ALL
SELECT 'Jobs without user_id' as table_name, COUNT(*) as count FROM jobs WHERE user_id IS NULL
UNION ALL  
SELECT 'Customers with user_id' as table_name, COUNT(*) as count FROM customers WHERE user_id IS NOT NULL
UNION ALL
SELECT 'Customers without user_id' as table_name, COUNT(*) as count FROM customers WHERE user_id IS NULL;
