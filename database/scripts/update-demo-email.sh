#!/bin/bash

# Script to update demo user email from demo2@myjobtrack.app to demo@myjobtrack.app

echo "🔄 Updating demo user email in database..."

# Run the migration
wrangler d1 execute myjobtrack-db --file=./database/migrations/002_update_demo_user_email.sql

echo "✅ Demo user email updated successfully"
echo "📧 Changed from: demo2@myjobtrack.app"
echo "📧 Changed to: demo@myjobtrack.app"
