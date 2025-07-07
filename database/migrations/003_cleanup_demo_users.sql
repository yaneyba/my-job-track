-- Migration to clean up additional demo users

-- Delete the demo@myjobtrack.com user and all associated data
DELETE FROM users WHERE email = 'demo@myjobtrack.com';

-- Delete any customers associated with demo@myjobtrack.com user
DELETE FROM customers WHERE email = 'demo@myjobtrack.com';

-- Verify only the correct demo user remains
SELECT 'Demo user cleanup completed - only demo@myjobtrack.app should remain' as message
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.app')
AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.com');
