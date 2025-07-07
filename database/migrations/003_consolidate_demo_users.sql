-- Migration to safely update demo user email from demo2@myjobtrack.app to demo@myjobtrack.app
-- This handles the case where demo@myjobtrack.app might already exist

-- First, check if we need to do anything
-- If demo2@myjobtrack.app exists and demo@myjobtrack.app doesn't exist, update it
UPDATE users 
SET email = 'demo@myjobtrack.app'
WHERE email = 'demo2@myjobtrack.app' 
AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.app');

-- If both exist, we need to merge or remove the duplicate
-- For safety, we'll remove the demo2 user if demo@ already exists
DELETE FROM users 
WHERE email = 'demo2@myjobtrack.app' 
AND EXISTS (SELECT 1 FROM users WHERE email = 'demo@myjobtrack.app');

-- Update customers table if any customer has demo2 email
UPDATE customers 
SET email = 'demo@myjobtrack.app'
WHERE email = 'demo2@myjobtrack.app';

-- Check the result
SELECT 
    COUNT(*) as demo_users_count,
    'Demo user consolidation complete' as message
FROM users 
WHERE email = 'demo@myjobtrack.app';
