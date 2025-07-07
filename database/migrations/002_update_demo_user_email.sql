-- Migration to clean up demo users and ensure correct demo user configuration

-- Delete the demo2 user and all associated data
DELETE FROM users WHERE email = 'demo2@myjobtrack.app';

-- Delete the demo@myjobtrack.com user and all associated data
DELETE FROM users WHERE email = 'demo@myjobtrack.com';

-- Delete any customers associated with demo2 user
DELETE FROM customers WHERE email = 'demo2@myjobtrack.app';

-- Delete any customers associated with demo@myjobtrack.com user
DELETE FROM customers WHERE email = 'demo@myjobtrack.com';

-- Update the demo user password hash to match environment variable
-- Note: This is a plain text password for demo purposes only
UPDATE users 
SET password_hash = 'DemoUser2025!'
WHERE email = 'demo@myjobtrack.app';

-- Verify the changes
SELECT 'Demo user cleanup completed successfully' as message
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.app');
