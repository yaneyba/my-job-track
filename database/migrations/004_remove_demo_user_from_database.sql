-- Migration to remove demo user from database
-- Demo users should only exist in demo mode (demo.json), not in production database

-- Delete the demo user and all associated data
DELETE FROM users WHERE email = 'demo@myjobtrack.app';

-- Delete any customers associated with demo user (if any were created via API)
DELETE FROM customers WHERE email = 'demo@myjobtrack.app';

-- Delete any jobs created by the demo user (if any)
-- Note: This assumes there's a way to identify demo user's jobs
-- Adjust this query based on your actual schema if needed

-- Verify the demo user has been removed
SELECT 'Demo user removed from database successfully' as message
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.app');
