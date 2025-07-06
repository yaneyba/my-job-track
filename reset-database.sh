#!/bin/bash

# Script to completely reset the database with proper schema
# WARNING: This will DELETE ALL DATA

echo "🚨 CRITICAL: Fixing data isolation issue"
echo "This will reset your database and delete all existing data."
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Resetting database with proper schema..."

# Assuming you're using wrangler for D1 operations
wrangler d1 execute your-database-name --file=schema-updated.sql

echo "✅ Database reset with proper user isolation"
echo "🔐 All tables now include user_id for proper data isolation"
echo ""
echo "Next steps:"
echo "1. Create a new user account"
echo "2. Test that data is properly isolated"
echo "3. Verify no cross-user data leakage"
