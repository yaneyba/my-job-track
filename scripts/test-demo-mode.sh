#!/bin/bash

# Script to test demo mode functionality

echo "🎭 Testing Demo Mode..."
echo

# Temporarily set demo mode
export VITE_USE_API_PROVIDER=false

echo "📋 Demo Mode Environment:"
echo "VITE_USE_API_PROVIDER: $VITE_USE_API_PROVIDER"
echo "VITE_DEMO_EMAIL: $VITE_DEMO_EMAIL"
echo "VITE_DEMO_PASSWORD: $VITE_DEMO_PASSWORD"
echo

echo "🎯 Demo Mode Features:"
echo "✅ Authentication: DemoDataProvider.authenticateUser()"
echo "✅ Demo User: Created from demoUserTemplate + environment credentials"
echo "✅ Customer Data: Static data from demo.json"
echo "✅ Job Data: Static data from demo.json"
echo "❌ Write Operations: Disabled (read-only mode)"
echo

echo "🧪 Testing Demo Mode:"
echo "1. Set VITE_USE_API_PROVIDER=false in your .env file"
echo "2. Clear browser localStorage: localStorage.clear()"
echo "3. Refresh the application"
echo "4. Login with demo credentials:"
echo "   Email: $VITE_DEMO_EMAIL"
echo "   Password: $VITE_DEMO_PASSWORD"
echo "5. Should see static demo data from demo.json"
echo "6. All write operations should be disabled"

echo
echo "🔄 To return to API mode:"
echo "Set VITE_USE_API_PROVIDER=true in your .env file"
